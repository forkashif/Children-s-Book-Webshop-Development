import type { Order } from './types.js';

export interface EmailLog {
  id: string;
  order_id: string;
  to: string;
  subject: string;
  type: 'order_confirmation' | 'order_shipped';
  timestamp: string;
  preview_html: string;
}

// In-memory log of sent emails so admin can preview them live in the dashboard!
export const sentEmailsLog: EmailLog[] = [];

/**
 * Format an enchanting HTML email for children's book order confirmation
 */
function generateOrderConfirmationHtml(order: Order): string {
  const itemsHtml = (order.items || []).map(item => `
    <tr style="border-bottom: 1px solid #E2E8F0;">
      <td style="padding: 14px 8px;">
        <strong style="color: #1E2538; font-size: 15px;">${item.book_title}</strong><br/>
        <span style="color: #64748B; font-size: 13px;">Format: ${item.format === 'hardcover' ? 'Hardcover Case Laminate' : 'Paperback'} (${item.sku})</span>
        ${item.dedication_text ? `
          <div style="margin-top: 6px; padding: 8px 12px; background: #FFFBEB; border-left: 3px solid #F59E0B; border-radius: 4px; font-size: 12px; color: #78350F; font-style: italic;">
            "Printed Dedication: ${item.dedication_text}"
          </div>
        ` : ''}
      </td>
      <td style="padding: 14px 8px; text-align: center; color: #475569;">x${item.quantity}</td>
      <td style="padding: 14px 8px; text-align: right; font-weight: 600; color: #1E2538;">€${item.total_price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FAF7F2; padding: 28px; border-radius: 16px; border: 1px solid #EAE0D0;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px dashed #E2D9C8;">
        <h1 style="color: #1E2538; font-size: 26px; margin: 0; font-family: 'Fredoka', Georgia, serif;">✨ Starlight Tales</h1>
        <p style="color: #D97706; font-size: 14px; margin-top: 4px; font-weight: bold; letter-spacing: 1px;">PRINTED ON DEMAND WITH LOVE</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #1E2538; font-size: 20px; margin-top: 0;">Hurrah! Your bedtime story is in the works! 🌟</h2>
        <p style="color: #475569; line-height: 1.6; font-size: 15px;">
          Dear <strong>${order.customer_name}</strong>,<br/>
          Thank you so much for ordering from Starlight Tales. Your books have been queued for custom printing at our premier automated bindery. Each page is pressed on heavyweight FSC-certified paper, carefully inspected, and packaged for a safe journey to your doorstep.
        </p>

        <div style="background: #FFFFFF; border-radius: 12px; padding: 18px; margin: 20px 0; border: 1px solid #E2E8F0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Order Reference:</span>
            <strong style="color: #1E2538; font-family: monospace; font-size: 14px;">${order.id}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
            <span style="color: #64748B; font-size: 13px;">Status:</span>
            <strong style="color: #059669; font-size: 13px;">Payment Received · Sent to Print Lab</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #64748B; font-size: 13px;">Delivery Method:</span>
            <span style="color: #1E2538; font-size: 13px;">${order.shipping_method}</span>
          </div>
        </div>

        <h3 style="color: #1E2538; font-size: 16px; margin-bottom: 8px;">Order Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <thead>
            <tr style="border-bottom: 2px solid #CBD5E1; text-align: left; font-size: 12px; color: #64748B;">
              <th style="padding: 8px;">Book</th>
              <th style="padding: 8px; text-align: center;">Qty</th>
              <th style="padding: 8px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="text-align: right; line-height: 1.8; font-size: 14px; color: #475569;">
          <div>Subtotal: €${order.subtotal.toFixed(2)}</div>
          <div>Tracked Shipping: €${order.shipping_cost.toFixed(2)}</div>
          <div style="font-size: 18px; font-weight: bold; color: #1E2538; margin-top: 4px;">Grand Total: €${order.total_amount.toFixed(2)}</div>
        </div>

        <div style="background: #F1F5F9; border-radius: 8px; padding: 14px; margin-top: 24px; font-size: 13px; color: #334155;">
          <strong>Shipping to:</strong><br/>
          ${order.shipping_address.recipient_name}<br/>
          ${order.shipping_address.address_line1}<br/>
          ${order.shipping_address.address_line2 ? order.shipping_address.address_line2 + '<br/>' : ''}
          ${order.shipping_address.city}, ${order.shipping_address.postal_code}, ${order.shipping_address.country_code}
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
        Questions about your order? Reach us anytime at <a href="mailto:hello@starlighttales.com" style="color: #3B82F6;">hello@starlighttales.com</a><br/>
        Starlight Tales · Handcrafted Children's Books · Printed on FSC-Certified Paper
      </div>
    </div>
  `;
}

/**
 * Format a shipping confirmation email with carrier tracking link
 */
function generateOrderShippedHtml(order: Order): string {
  return `
    <div style="font-family: 'Nunito', Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #FAF7F2; padding: 28px; border-radius: 16px; border: 1px solid #EAE0D0;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 2px dashed #E2D9C8;">
        <h1 style="color: #1E2538; font-size: 26px; margin: 0; font-family: 'Fredoka', Georgia, serif;">✨ Starlight Tales</h1>
        <p style="color: #059669; font-size: 14px; margin-top: 4px; font-weight: bold; letter-spacing: 1px;">PACKAGE DISPATCHED &amp; ON ITS WAY!</p>
      </div>

      <div style="padding: 24px 0;">
        <h2 style="color: #1E2538; font-size: 20px; margin-top: 0;">Good news! Your books are on their journey! 🚀</h2>
        <p style="color: #475569; line-height: 1.6; font-size: 15px;">
          Dear <strong>${order.customer_name}</strong>,<br/>
          Your order has successfully completed printing and quality binding at our print lab. It has been carefully packaged and handed over to the courier.
        </p>

        <div style="background: #EFF6FF; border: 1px solid #BFDBFE; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
          <div style="color: #1E3A8A; font-size: 13px; font-weight: bold; text-transform: uppercase;">Tracking Number</div>
          <div style="font-size: 22px; font-weight: bold; color: #1D4ED8; font-family: monospace; margin: 8px 0;">
            ${order.tracking_number || 'TRACK-ST-DISPATCHED'}
          </div>
          <div style="color: #475569; font-size: 13px; margin-bottom: 16px;">Carrier: ${order.carrier_name || 'National Postal / Courier Service'}</div>
          
          ${order.tracking_url ? `
            <a href="${order.tracking_url}" target="_blank" style="display: inline-block; background: #2563EB; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; font-size: 14px;">
              Track Your Package Online &rarr;
            </a>
          ` : ''}
        </div>

        <div style="background: #FFFFFF; border-radius: 8px; padding: 14px; border: 1px solid #E2E8F0; font-size: 13px; color: #334155;">
          <strong>Delivering to:</strong><br/>
          ${order.shipping_address.recipient_name}<br/>
          ${order.shipping_address.address_line1}, ${order.shipping_address.city}, ${order.shipping_address.country_code}
        </div>
      </div>

      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #94A3B8;">
        Need assistance? Reply directly to this email or visit our <a href="/track" style="color: #3B82F6;">order tracking page</a>.<br/>
        Starlight Tales · Enchanting Children's Books
      </div>
    </div>
  `;
}

export const emailService = {
  /**
   * Send Order Confirmation Email
   */
  async sendOrderConfirmation(order: Order): Promise<boolean> {
    const subject = `Your Starlight Tales Order is Confirmed! (Ref: ${order.id}) ✨`;
    const previewHtml = generateOrderConfirmationHtml(order);

    const logEntry: EmailLog = {
      id: 'email-' + Math.random().toString(36).substring(2, 9),
      order_id: order.id,
      to: order.customer_email,
      subject,
      type: 'order_confirmation',
      timestamp: new Date().toISOString(),
      preview_html: previewHtml
    };
    sentEmailsLog.unshift(logEntry);
    if (sentEmailsLog.length > 50) sentEmailsLog.pop();

    console.log(`[EmailService] ✉️ Order Confirmation sent to ${order.customer_email} (Order ${order.id})`);

    // If Resend API key is provided, send real email via Resend
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.STORE_EMAIL || 'orders@starlighttales.com',
            to: order.customer_email,
            subject,
            html: previewHtml
          })
        });
      } catch (err) {
        console.warn('[EmailService] Resend API error (logged to in-app preview):', err);
      }
    }

    return true;
  },

  /**
   * Send Order Shipped Email with Tracking URL
   */
  async sendOrderShipped(order: Order): Promise<boolean> {
    const subject = `Your Starlight Tales order has shipped! (Tracking: ${order.tracking_number || order.id}) 📦`;
    const previewHtml = generateOrderShippedHtml(order);

    const logEntry: EmailLog = {
      id: 'email-' + Math.random().toString(36).substring(2, 9),
      order_id: order.id,
      to: order.customer_email,
      subject,
      type: 'order_shipped',
      timestamp: new Date().toISOString(),
      preview_html: previewHtml
    };
    sentEmailsLog.unshift(logEntry);
    if (sentEmailsLog.length > 50) sentEmailsLog.pop();

    console.log(`[EmailService] 📦 Shipping Notification sent to ${order.customer_email} (Carrier: ${order.carrier_name}, Tracking: ${order.tracking_number})`);

    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: process.env.STORE_EMAIL || 'orders@starlighttales.com',
            to: order.customer_email,
            subject,
            html: previewHtml
          })
        });
      } catch (err) {
        console.warn('[EmailService] Resend API error (logged to in-app preview):', err);
      }
    }

    return true;
  },

  getRecentEmails(): EmailLog[] {
    return sentEmailsLog;
  }
};
