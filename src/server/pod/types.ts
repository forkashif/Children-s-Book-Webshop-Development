import type { 
  ShippingAddress, 
  ShippingRate, 
  PODOrderPayload, 
  PODOrderResponse, 
  PODStatusResponse 
} from '../types.js';

export interface PODProvider {
  readonly name: string;

  /**
   * Calculate live real-time shipping quotes for a given destination address and cart items
   */
  getShippingRates(
    address: ShippingAddress, 
    items: Array<{ sku: string; product_code: string; quantity: number; weight_grams?: number }>
  ): Promise<ShippingRate[]>;

  /**
   * Submit an order to the Print-on-Demand provider
   */
  createOrder(orderPayload: PODOrderPayload): Promise<PODOrderResponse>;

  /**
   * Fetch current production & tracking status from the provider
   */
  getOrderStatus(providerOrderId: string): Promise<PODStatusResponse>;

  /**
   * Parse and handle incoming webhooks from the POD provider
   */
  handleWebhook(payload: any, headers?: Record<string, string | string[] | undefined>): Promise<{
    handled: boolean;
    provider_order_id?: string;
    new_status?: string;
    tracking_number?: string;
    tracking_url?: string;
    carrier_name?: string;
    message?: string;
  }>;
}
