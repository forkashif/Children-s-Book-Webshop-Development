import type { PODProvider } from './types.js';
import type { 
  ShippingAddress, 
  ShippingRate, 
  PODOrderPayload, 
  PODOrderResponse, 
  PODStatusResponse,
  PODStatus 
} from '../types.js';

export class GelatoProvider implements PODProvider {
  readonly name = 'gelato';
  private apiKey: string;
  private baseUrl = 'https://order.gelatoapis.com/v4';

  constructor() {
    this.apiKey = process.env.GELATO_API_KEY || '';
  }

  async getShippingRates(
    address: ShippingAddress, 
    items: Array<{ sku: string; product_code: string; quantity: number }>
  ): Promise<ShippingRate[]> {
    const country = address.country_code || 'IE';
    return [
      {
        id: 'gelato_standard',
        name: 'Gelato Standard Delivery',
        description: `Local eco-print routing to ${country}`,
        amount: 4.80,
        currency: 'EUR',
        estimated_days_min: 3,
        estimated_days_max: 6,
        carrier: 'Gelato Local Postal Partners'
      },
      {
        id: 'gelato_express',
        name: 'Gelato Express Courier',
        description: 'Priority printing and direct courier delivery',
        amount: 10.20,
        currency: 'EUR',
        estimated_days_min: 2,
        estimated_days_max: 4,
        carrier: 'DHL Express'
      }
    ];
  }

  async createOrder(orderPayload: PODOrderPayload): Promise<PODOrderResponse> {
    const mockGelatoId = `gelato_ord_${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      provider_order_id: mockGelatoId,
      status: 'sent_to_printer',
      estimated_dispatch_date: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      raw_response: {
        id: mockGelatoId,
        orderType: 'order',
        channel: 'ecommerce',
        state: 'created'
      }
    };
  }

  async getOrderStatus(providerOrderId: string): Promise<PODStatusResponse> {
    return {
      provider_order_id: providerOrderId,
      status: 'in_production',
      tracking_number: 'GL' + Math.floor(10000000 + Math.random() * 90000000) + 'EU',
      tracking_url: 'https://track.gelato.com/',
      carrier_name: 'Gelato Logistics Network'
    };
  }

  async handleWebhook(payload: any) {
    const event = payload?.event || payload?.type;
    const orderId = payload?.orderId || payload?.data?.id;
    return {
      handled: true,
      provider_order_id: orderId,
      new_status: event === 'order_dispatched' ? ('shipped' as PODStatus) : undefined,
      tracking_number: payload?.trackingNumber,
      tracking_url: payload?.trackingUrl,
      message: 'Gelato webhook parsed'
    };
  }
}
