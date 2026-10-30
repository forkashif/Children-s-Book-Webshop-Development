export type BookFormat = 'hardcover' | 'paperback';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PODStatus = 
  | 'pending_payment'
  | 'sent_to_printer'
  | 'in_production'
  | 'shipped'
  | 'delivered'
  | 'failed'
  | 'cancelled';

export interface BookVariant {
  id: string;
  book_id: string;
  format: BookFormat;
  title: string;
  sku: string;
  price: number;
  sale_price: number | null;
  pod_product_code: string;
  print_file_url: string;
  weight_grams: number;
  in_stock: boolean;
}

export interface Book {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  author: string;
  illustrator: string;
  description: string;
  excerpt: string;
  age_range: string;
  category: string;
  page_count: number;
  trim_size: string;
  cover_finish: string;
  cover_image: string;
  gallery_images: string[];
  featured: boolean;
  bestseller: boolean;
  rating: number;
  review_count: number;
  seo_title: string;
  seo_description: string;
  created_at: string;
  updated_at: string;
  variants?: BookVariant[];
}

export interface ShippingAddress {
  recipient_name: string;
  company_name?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state_or_county?: string;
  postal_code: string;
  country_code: string; // ISO 2-letter, e.g. 'IE', 'GB', 'US', 'DE', 'FR'
  phone?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  book_id: string;
  variant_id: string;
  book_title: string;
  format: BookFormat;
  sku: string;
  pod_product_code: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  dedication_text?: string;
  print_file_url: string;
  cover_image?: string;
}

export interface TrackingEvent {
  id: string;
  order_id: string;
  status: PODStatus | string;
  description: string;
  location?: string;
  timestamp: string;
}

export interface Order {
  id: string;
  customer_email: string;
  customer_name: string;
  customer_phone?: string;
  subtotal: number;
  shipping_cost: number;
  shipping_method: string;
  tax_amount: number;
  total_amount: number;
  currency: string;
  payment_status: PaymentStatus;
  payment_method: 'stripe' | 'paypal' | 'sandbox';
  stripe_payment_intent_id?: string;
  pod_provider: string;
  pod_order_id?: string;
  pod_status: PODStatus;
  pod_retry_count: number;
  pod_last_error?: string;
  tracking_number?: string;
  tracking_url?: string;
  carrier_name?: string;
  shipping_address: ShippingAddress;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  tracking_events?: TrackingEvent[];
}

export interface ShippingRate {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  estimated_days_min: number;
  estimated_days_max: number;
  carrier?: string;
}

export interface PODOrderPayload {
  order_reference: string;
  shipping_method: string; // 'Budget', 'Standard', 'Express', etc.
  recipient: ShippingAddress & { email: string };
  items: Array<{
    sku: string;
    product_code: string;
    quantity: number;
    print_file_url: string;
    title: string;
    format: BookFormat;
    dedication_text?: string;
  }>;
}

export interface PODOrderResponse {
  success: boolean;
  provider_order_id?: string;
  status: PODStatus;
  estimated_dispatch_date?: string;
  error?: string;
  raw_response?: any;
}

export interface PODStatusResponse {
  provider_order_id: string;
  status: PODStatus;
  tracking_number?: string;
  tracking_url?: string;
  carrier_name?: string;
  dispatched_at?: string;
  raw_response?: any;
}

export interface PODLog {
  id: string;
  order_id: string;
  provider: string;
  action: string;
  status: 'success' | 'error' | 'info';
  request_payload?: string;
  response_payload?: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  password_hash: string;
  name: string;
  role: 'superadmin' | 'editor';
  created_at: string;
}

export interface StoreSettings {
  store_name: string;
  currency: string;
  supported_countries: string[];
  contact_email: string;
  tax_rate_percent: number;
  prices_include_tax: boolean;
  pod_provider: 'prodigi' | 'gelato' | 'printful';
  pod_sandbox_mode: boolean;
  free_shipping_threshold: number; // 0 for none, or e.g. 50
  notice_banner_text: string;
  notice_banner_active: boolean;
}
