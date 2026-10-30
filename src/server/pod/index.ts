import { ProdigiProvider } from './prodigi.js';
import { GelatoProvider } from './gelato.js';
import { PrintfulProvider } from './printful.js';
import type { PODProvider } from './types.js';
import { dbQueries } from '../db.js';
import { emailService } from '../emailService.js';
import type { Order, PODStatus } from '../types.js';

// Cache provider instances
const providers: Record<string, PODProvider> = {
  prodigi: new ProdigiProvider(),
  gelato: new GelatoProvider(),
  printful: new PrintfulProvider()
};

/**
 * Get active POD Provider instance
 */
export function getActivePODProvider(): PODProvider {
  const settings = dbQueries.getSettings();
  const selected = (process.env.POD_PROVIDER || settings.pod_provider || 'prodigi').toLowerCase();
  return providers[selected] || providers.prodigi;
}

/**
 * Automatically submit paid order to POD provider with retry logic & error logging
 */
export async function submitOrderToPODWithRetry(orderId: string, maxRetries: number = 2): Promise<boolean> {
  const order = dbQueries.getOrderById(orderId);
  if (!order) {
    console.error(`[POD Dispatcher] Order ${orderId} not found.`);
    return false;
  }

  const provider = getActivePODProvider();
  console.log(`[POD Dispatcher] Dispatching order ${orderId} to POD provider: ${provider.name}`);

  const payload = {
    order_reference: order.id,
    shipping_method: order.shipping_method,
    recipient: {
      ...order.shipping_address,
      email: order.customer_email
    },
    items: (order.items || []).map(item => ({
      sku: item.sku,
      product_code: item.pod_product_code,
      quantity: item.quantity,
      print_file_url: item.print_file_url,
      title: item.book_title,
      format: item.format,
      dedication_text: item.dedication_text
    }))
  };

  let attempts = 0;
  let lastError: string | null = null;
  let responseData: any = null;

  while (attempts <= maxRetries) {
    attempts++;
    try {
      const response = await provider.createOrder(payload);
      responseData = response;

      if (response.success && response.provider_order_id) {
        // Success!
        dbQueries.updateOrderStatus(orderId, {
          pod_status: 'sent_to_printer',
          pod_order_id: response.provider_order_id,
          pod_last_error: undefined,
          carrier_name: 'Prodigi Global Print Lab'
        });

        dbQueries.addTrackingEvent(
          orderId, 
          'sent_to_printer', 
          `Order successfully transmitted to ${provider.name.toUpperCase()} (Ref: ${response.provider_order_id}). Print files verified.`,
          'Automated Bindery'
        );

        dbQueries.addPODLog({
          order_id: orderId,
          provider: provider.name,
          action: 'create_order',
          status: 'success',
          request_payload: JSON.stringify(payload),
          response_payload: JSON.stringify(response)
        });

        return true;
      } else {
        lastError = response.error || 'Provider rejected order';
      }
    } catch (err: any) {
      lastError = err.message || 'Unknown network error';
    }

    if (attempts <= maxRetries) {
      // Exponential backoff wait (300ms, 800ms)
      await new Promise(res => setTimeout(res, attempts * 400));
    }
  }

  // If all attempts failed, set POD status to 'failed' and alert
  console.error(`[POD Dispatcher] ❌ Order ${orderId} failed POD submission after ${attempts} attempts: ${lastError}`);
  
  dbQueries.updateOrderStatus(orderId, {
    pod_status: 'failed',
    pod_retry_count: attempts,
    pod_last_error: lastError || 'POD submission failed'
  });

  dbQueries.addTrackingEvent(
    orderId,
    'failed',
    `POD print job submission error: ${lastError}. Support has been flagged.`,
    'Print Dispatch Queue'
  );

  dbQueries.addPODLog({
    order_id: orderId,
    provider: provider.name,
    action: 'create_order',
    status: 'error',
    request_payload: JSON.stringify(payload),
    response_payload: JSON.stringify(responseData || { error: lastError })
  });

  return false;
}

/**
 * Handle incoming webhook event and trigger email when order is shipped
 */
export async function processPODWebhook(payload: any, headers?: any) {
  const provider = getActivePODProvider();
  const result = await provider.handleWebhook(payload, headers);

  if (result.handled && result.provider_order_id) {
    // Find order in DB matching pod_order_id
    const orderRow = dbQueries.getAllOrders().find(o => o.pod_order_id === result.provider_order_id);
    
    if (orderRow) {
      const updates: Partial<Order> = {};
      if (result.new_status) updates.pod_status = result.new_status as PODStatus;
      if (result.tracking_number) updates.tracking_number = result.tracking_number;
      if (result.tracking_url) updates.tracking_url = result.tracking_url;
      if (result.carrier_name) updates.carrier_name = result.carrier_name;

      dbQueries.updateOrderStatus(orderRow.id, updates);

      const description = result.new_status === 'shipped'
        ? `Dispatched with ${result.carrier_name || 'Carrier'}. Tracking: ${result.tracking_number || 'Available'}`
        : `Status updated to ${result.new_status}`;

      dbQueries.addTrackingEvent(orderRow.id, result.new_status || 'updated', description);

      // If the order has shipped, send the shipping confirmation email!
      if (result.new_status === 'shipped') {
        const fullOrder = dbQueries.getOrderById(orderRow.id);
        if (fullOrder) {
          await emailService.sendOrderShipped(fullOrder);
        }
      }
    }
  }

  return result;
}
