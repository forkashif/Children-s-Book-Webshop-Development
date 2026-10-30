import { Router } from 'express';
import Stripe from 'stripe';
import { dbQueries } from './db.js';
import { getActivePODProvider, submitOrderToPODWithRetry, processPODWebhook } from './pod/index.js';
import { emailService } from './emailService.js';
import { authenticateAdmin, requireAdminAuth } from './auth.js';
import type { ShippingAddress, PODStatus } from './types.js';

export const apiRouter = Router();

// Initialize Stripe if secret key is configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeConfigured = Boolean(stripeSecretKey && !stripeSecretKey.includes('placeholder') && !stripeSecretKey.includes('test_placeholder'));
let stripeClient: Stripe | null = null;
if (isStripeConfigured && stripeSecretKey) {
  stripeClient = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24.acacia' as any
  });
}

// -------------------------------------------------------------
// PUBLIC STORE ENDPOINTS
// -------------------------------------------------------------

/**
 * GET /api/settings - Public store configuration
 */
apiRouter.get('/settings', (req, res) => {
  const settings = dbQueries.getSettings();
  res.json({
    store_name: settings.store_name,
    currency: settings.currency || 'EUR',
    supported_countries: settings.supported_countries,
    contact_email: settings.contact_email,
    free_shipping_threshold: settings.free_shipping_threshold,
    notice_banner_text: settings.notice_banner_text,
    notice_banner_active: settings.notice_banner_active,
    pod_provider: settings.pod_provider,
    stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_demo_mode',
    is_stripe_live: isStripeConfigured
  });
});

/**
 * GET /api/books - Get all books with variants
 */
apiRouter.get('/books', (req, res) => {
  const books = dbQueries.getAllBooks();
  res.json(books);
});

/**
 * GET /api/books/:slug - Single book details
 */
apiRouter.get('/books/:slug', (req, res) => {
  const book = dbQueries.getBookBySlug(req.params.slug) || dbQueries.getBookById(req.params.slug);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
});

/**
 * POST /api/shipping-rates - Calculate live real-time POD shipping rates
 */
apiRouter.post('/shipping-rates', async (req, res) => {
  try {
    const { address, items } = req.body as {
      address: ShippingAddress;
      items: Array<{ sku: string; product_code: string; quantity: number; weight_grams?: number }>;
    };

    if (!address || !address.country_code) {
      return res.status(400).json({ error: 'Shipping address with country_code is required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Cart items are required to calculate shipping' });
    }

    const podProvider = getActivePODProvider();
    const rates = await podProvider.getShippingRates(address, items);

    // Check if free shipping threshold is reached
    const settings = dbQueries.getSettings();
    const subtotal = (req.body.subtotal as number) || 0;
    
    if (settings.free_shipping_threshold > 0 && subtotal >= settings.free_shipping_threshold) {
      // Make standard shipping free!
      const updatedRates = rates.map(rate => {
        if (rate.id.includes('standard')) {
          return {
            ...rate,
            name: `${rate.name} (Free threshold discount applied!)`,
            amount: 0
          };
        }
        return rate;
      });
      return res.json({ rates: updatedRates, provider: podProvider.name });
    }

    res.json({ rates, provider: podProvider.name });
  } catch (err: any) {
    console.error('Error calculating shipping rates:', err);
    res.status(500).json({ error: err.message || 'Failed to quote shipping rates' });
  }
});

/**
 * POST /api/checkout/create-session - Initialize checkout or Stripe session
 */
apiRouter.post('/checkout/create-session', async (req, res) => {
  try {
    const { 
      items, 
      shipping_address, 
      shipping_rate, 
      customer_email, 
      customer_name, 
      customer_phone,
      payment_method_choice // 'stripe' | 'paypal' | 'sandbox'
    } = req.body;

    if (!items || items.length === 0 || !shipping_address || !customer_email) {
      return res.status(400).json({ error: 'Missing required order fields' });
    }

    // Verify variants and calculate subtotal securely on the server
    let subtotal = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const variant = dbQueries.getVariantById(item.variant_id);
      if (!variant) {
        return res.status(400).json({ error: `Variant ${item.variant_id} is unavailable` });
      }
      const unitPrice = variant.sale_price !== null ? variant.sale_price : variant.price;
      const itemTotal = unitPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        book_id: variant.book_id,
        variant_id: variant.id,
        book_title: item.book_title || 'Children\'s Book',
        format: variant.format,
        sku: variant.sku,
        pod_product_code: variant.pod_product_code,
        unit_price: unitPrice,
        quantity: item.quantity,
        total_price: itemTotal,
        dedication_text: item.dedication_text || null,
        print_file_url: variant.print_file_url,
        cover_image: item.cover_image || null
      });
    }

    const shippingCost = Number(shipping_rate?.amount || 4.95);
    const totalAmount = Number((subtotal + shippingCost).toFixed(2));
    const orderId = `ST-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = dbQueries.createOrder({
      id: orderId,
      customer_email,
      customer_name,
      customer_phone,
      subtotal: Number(subtotal.toFixed(2)),
      shipping_cost: shippingCost,
      shipping_method: shipping_rate?.name || 'Standard POD Tracked',
      tax_amount: 0,
      total_amount: totalAmount,
      currency: 'EUR',
      payment_status: 'pending',
      payment_method: payment_method_choice || 'stripe',
      pod_provider: getActivePODProvider().name,
      pod_status: 'pending_payment',
      pod_retry_count: 0,
      shipping_address,
      items: orderItems
    });

    // If Stripe is configured and live, create a Stripe Checkout Session
    if (stripeClient && payment_method_choice === 'stripe') {
      const appUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
      const session = await stripeClient.checkout.sessions.create({
        customer_email,
        line_items: [
          ...orderItems.map(i => ({
            price_data: {
              currency: 'eur',
              product_data: {
                name: `${i.book_title} (${i.format === 'hardcover' ? 'Hardcover Case Laminate' : 'Paperback'})`,
                description: i.dedication_text ? `Personalized dedication: "${i.dedication_text}"` : 'Children\'s Picture Book',
              },
              unit_amount: Math.round(i.unit_price * 100),
            },
            quantity: i.quantity,
          })),
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Tracked POD Shipping: ${shipping_rate?.name || 'Standard'}`,
              },
              unit_amount: Math.round(shippingCost * 100),
            },
            quantity: 1,
          }
        ],
        mode: 'payment',
        client_reference_id: orderId,
        metadata: {
          starlight_order_id: orderId
        },
        success_url: `${appUrl}/order-confirmation?order_id=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/checkout?cancelled=1`
      });

      return res.json({
        order_id: orderId,
        checkout_url: session.url,
        is_stripe_live: true
      });
    }

    // Default Sandbox / Direct Payment Flow (instant seamless simulation)
    return res.json({
      order_id: orderId,
      subtotal,
      shippingCost,
      totalAmount,
      is_stripe_live: false,
      message: 'Order created and ready for payment confirmation'
    });
  } catch (err: any) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message || 'Failed to initiate checkout' });
  }
});

/**
 * POST /api/checkout/confirm-simulated - Complete payment in sandbox mode & auto-dispatch to POD
 */
apiRouter.post('/checkout/confirm-simulated', async (req, res) => {
  try {
    const { order_id, payment_method } = req.body;
    const order = dbQueries.getOrderById(order_id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Update to paid
    dbQueries.updateOrderStatus(order_id, {
      payment_status: 'paid',
      stripe_payment_intent_id: `pi_sim_${Math.random().toString(36).substring(2, 10)}`
    });

    dbQueries.addTrackingEvent(order_id, 'paid', 'Payment verified and confirmed.');

    // 1. Send Order Confirmation Email immediately
    const updatedOrder = dbQueries.getOrderById(order_id)!;
    await emailService.sendOrderConfirmation(updatedOrder);

    // 2. Automatically submit to POD provider (Prodigi / Gelato / Printful)
    // Run asynchronously or awaited so user immediately sees dispatch status
    submitOrderToPODWithRetry(order_id).catch(err => {
      console.error(`Error in POD automatic submission for order ${order_id}:`, err);
    });

    const finalOrder = dbQueries.getOrderById(order_id);
    res.json({ success: true, order: finalOrder });
  } catch (err: any) {
    console.error('Error confirming order:', err);
    res.status(500).json({ error: err.message || 'Failed to complete order payment' });
  }
});

/**
 * GET /api/orders/track - Track order by ID and Email
 */
apiRouter.get('/orders/track', (req, res) => {
  const { order_id, email } = req.query as { order_id?: string; email?: string };

  if (!order_id || !email) {
    return res.status(400).json({ error: 'Order number and customer email are required' });
  }

  const order = dbQueries.getOrderByTracking(order_id, email);
  if (!order) {
    return res.status(404).json({ error: 'No order found matching that reference number and email address.' });
  }

  res.json(order);
});

/**
 * GET /api/orders/:id - Get public confirmation view of an order
 */
apiRouter.get('/orders/:id', (req, res) => {
  const order = dbQueries.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json(order);
});

// -------------------------------------------------------------
// WEBHOOKS
// -------------------------------------------------------------

/**
 * POST /api/webhooks/stripe - Stripe webhook listener
 */
apiRouter.post('/webhooks/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  if (stripeClient && webhookSecret && sig) {
    try {
      event = stripeClient.webhooks.constructEvent((req as any).rawBody || req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error(`⚠️ Stripe Webhook signature verification failed:`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  } else {
    // Development or sandbox mode payload
    event = req.body;
  }

  console.log(`[Stripe Webhook] Received event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.client_reference_id || session.metadata?.starlight_order_id;

    if (orderId) {
      console.log(`[Stripe Webhook] Payment succeeded for order: ${orderId}`);
      dbQueries.updateOrderStatus(orderId, {
        payment_status: 'paid',
        stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : undefined
      });

      const order = dbQueries.getOrderById(orderId);
      if (order) {
        await emailService.sendOrderConfirmation(order);
        // Automatically dispatch to POD provider!
        await submitOrderToPODWithRetry(orderId);
      }
    }
  }

  res.json({ received: true });
});

/**
 * POST /api/webhooks/pod - POD provider webhook (Prodigi / Gelato / Printful)
 */
apiRouter.post('/webhooks/pod', async (req, res) => {
  try {
    const result = await processPODWebhook(req.body, req.headers);
    res.json(result);
  } catch (err: any) {
    console.error('Error handling POD webhook:', err);
    res.status(500).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN CMS ENDPOINTS (Protected)
// -------------------------------------------------------------

/**
 * POST /api/admin/login
 */
apiRouter.post('/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const result = authenticateAdmin(email, password);
  if (!result.success) {
    return res.status(401).json({ error: result.error || 'Authentication failed' });
  }

  res.json(result);
});

/**
 * GET /api/admin/me
 */
apiRouter.get('/admin/me', requireAdminAuth, (req, res) => {
  res.json({ user: (req as any).adminSession });
});

/**
 * GET /api/admin/dashboard - Metrics
 */
apiRouter.get('/admin/dashboard', requireAdminAuth, (req, res) => {
  const stats = dbQueries.getDashboardStats();
  const recentOrders = dbQueries.getAllOrders().slice(0, 8);
  const podLogs = dbQueries.getPODLogs(10);
  res.json({
    stats,
    recentOrders,
    podLogs
  });
});

/**
 * GET /api/admin/orders - List & filter orders
 */
apiRouter.get('/admin/orders', requireAdminAuth, (req, res) => {
  const { search, podStatus } = req.query as { search?: string; podStatus?: string };
  const orders = dbQueries.getAllOrders(search, podStatus);
  res.json(orders);
});

/**
 * GET /api/admin/orders/:id - Single order details
 */
apiRouter.get('/admin/orders/:id', requireAdminAuth, (req, res) => {
  const order = dbQueries.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

/**
 * POST /api/admin/orders/:id/retry-pod - Manual retry for failed POD order
 */
apiRouter.post('/admin/orders/:id/retry-pod', requireAdminAuth, async (req, res) => {
  const success = await submitOrderToPODWithRetry(req.params.id);
  const updated = dbQueries.getOrderById(req.params.id);
  res.json({ success, order: updated });
});

/**
 * POST /api/admin/orders/:id/resend-email - Resend tracking or confirmation email
 */
apiRouter.post('/admin/orders/:id/resend-email', requireAdminAuth, async (req, res) => {
  const { type } = req.body as { type: 'confirmation' | 'shipped' };
  const order = dbQueries.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (type === 'shipped') {
    await emailService.sendOrderShipped(order);
  } else {
    await emailService.sendOrderConfirmation(order);
  }

  res.json({ success: true, message: `Resent ${type} email to ${order.customer_email}` });
});

/**
 * POST /api/admin/orders/:id/simulate-pod-status - Test order lifecycle in Admin
 */
apiRouter.post('/admin/orders/:id/simulate-pod-status', requireAdminAuth, async (req, res) => {
  const { status, tracking_number, carrier_name } = req.body as { 
    status: PODStatus; 
    tracking_number?: string; 
    carrier_name?: string 
  };

  const order = dbQueries.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  const trackingNum = tracking_number || ('AP' + Math.floor(100000000 + Math.random() * 900000000) + 'IE');
  const carrier = carrier_name || 'An Post Tracked Priority';
  const trackingUrl = `https://www.anpost.com/Post-Parcels/Track/History?item=${trackingNum}`;

  dbQueries.updateOrderStatus(order.id, {
    pod_status: status,
    tracking_number: status === 'shipped' || status === 'delivered' ? trackingNum : order.tracking_number,
    tracking_url: status === 'shipped' || status === 'delivered' ? trackingUrl : order.tracking_url,
    carrier_name: carrier
  });

  dbQueries.addTrackingEvent(
    order.id,
    status,
    `Status updated to ${status.replace('_', ' ').toUpperCase()}${status === 'shipped' ? ` (${carrier} - Tracking: ${trackingNum})` : ''}`,
    'Regional Hub'
  );

  const updated = dbQueries.getOrderById(order.id)!;

  // If set to shipped, trigger the shipping email
  if (status === 'shipped') {
    await emailService.sendOrderShipped(updated);
  }

  res.json({ success: true, order: updated });
});

/**
 * Books management
 */
apiRouter.get('/admin/books', requireAdminAuth, (req, res) => {
  res.json(dbQueries.getAllBooks());
});

apiRouter.post('/admin/books', requireAdminAuth, (req, res) => {
  try {
    const { book, variants } = req.body;
    const created = dbQueries.createBook(book, variants || []);
    res.json(created);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.put('/admin/books/:id', requireAdminAuth, (req, res) => {
  try {
    const { book, variants } = req.body;
    const updated = dbQueries.updateBook(req.params.id, book, variants);
    if (!updated) return res.status(404).json({ error: 'Book not found' });
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/admin/books/:id', requireAdminAuth, (req, res) => {
  const success = dbQueries.deleteBook(req.params.id);
  res.json({ success });
});

/**
 * POD Logs & Email inspector
 */
apiRouter.get('/admin/pod-logs', requireAdminAuth, (req, res) => {
  res.json(dbQueries.getPODLogs(50));
});

apiRouter.get('/admin/emails', requireAdminAuth, (req, res) => {
  res.json(emailService.getRecentEmails());
});

/**
 * Store settings
 */
apiRouter.get('/admin/settings', requireAdminAuth, (req, res) => {
  res.json(dbQueries.getSettings());
});

apiRouter.put('/admin/settings', requireAdminAuth, (req, res) => {
  dbQueries.updateSettings(req.body);
  res.json({ success: true, settings: dbQueries.getSettings() });
});
