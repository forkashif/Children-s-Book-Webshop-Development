import type { PODProvider } from './types.js';
import type { 
  ShippingAddress, 
  ShippingRate, 
  PODOrderPayload, 
  PODOrderResponse, 
  PODStatusResponse,
  PODStatus 
} from '../types.js';

export class PrintfulProvider implements PODProvider {
  readonly name = 'printful';
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.PRINTFUL_API_KEY || '';
  }

  async getShippingRates(
    address: ShippingAddress, 
    items: Array<{ sku: string; product_code: string; quantity: number }>
  ): Promise<ShippingRate[]> {
    const country = address.country_code || 'IE';
    return [
      {
        id: 'printful_standard',
        name: 'Printful Flat Rate Standard',
        description: `Direct delivery to ${country}`,
        amount: 5.20,
        currency: 'EUR',
        estimated_days_min: 4,
        estimated_days_max: 7,
        carrier: 'Printful Partner Courier'
      },
      {
        id: 'printful_express',
        name: 'Printful Express Courier',
        description: 'Express tracked air courier',
        amount: 11.90,
        currency: 'EUR',
        estimated_days_min: 2,
        estimated_days_max: 4,
        carrier: 'FedEx / DPD'
      }
    ];
  }

  async createOrder(orderPayload: PODOrderPayload): Promise<PODOrderResponse> {
    const mockPrintfulId = `printful_ord_${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      success: true,
      provider_order_id: mockPrintfulId,
      status: 'sent_to_printer',
      estimated_dispatch_date: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      raw_response: {
        code: 200,
        result: {
          id: mockPrintfulId,
          status: 'draft'
        }
      }
    };
  }

  async getOrderStatus(providerOrderId: string): Promise<PODStatusResponse> {
    return {
      provider_order_id: providerOrderId,
      status: 'in_production',
      tracking_number: 'PF' + Math.floor(10000000 + Math.random() * 90000000) + 'GB',
      tracking_url: 'https://www.printful.com/tracking',
      carrier_name: 'Printful Logistics'
    };
  }

  async handleWebhook(payload: any) {
    const type = payload?.type;
    const orderId = payload?.data?.order?.id;
    return {
      handled: true,
      provider_order_id: orderId ? String(orderId) : undefined,
      new_status: type === 'package_shipped' ? ('shipped' as PODStatus) : undefined,
      tracking_number: payload?.data?.shipment?.tracking_number,
      tracking_url: payload?.data?.shipment?.tracking_url,
      carrier_name: payload?.data?.shipment?.carrier,
      message: 'Printful webhook parsed'
    };
  }
}
