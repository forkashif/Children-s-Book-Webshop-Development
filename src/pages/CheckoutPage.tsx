import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Lock, 
  ArrowRight, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useCart } from '../context/CartContext.js';
import type { ShippingAddress, ShippingRate } from '../types/store.js';

interface CheckoutPageProps {
  onOrderSuccess: (orderId: string) => void;
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onOrderSuccess, onNavigate }) => {
  const { items, subtotal, clearCart } = useCart();

  // Customer Contact
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Shipping Address
  const [address, setAddress] = useState<ShippingAddress>({
    recipient_name: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state_or_county: '',
    postal_code: '',
    country_code: 'IE'
  });

  // Shipping Rates from POD Provider
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string>('');
  const [isLoadingRates, setIsLoadingRates] = useState(false);
  const [podProviderName, setPodProviderName] = useState('prodigi');

  // Payment Options
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paypal'>('stripe');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleNameChange = (val: string) => {
    setCustomerName(val);
    if (!address.recipient_name) {
      setAddress(prev => ({ ...prev, recipient_name: val }));
    }
  };

  const fetchShippingRates = async (destCountry: string) => {
    if (items.length === 0) return;
    setIsLoadingRates(true);

    try {
      const res = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: { ...address, country_code: destCountry },
          items: items.map(i => ({
            sku: i.sku,
            product_code: i.pod_product_code,
            quantity: i.quantity,
          })),
          subtotal
        })
      });

      if (res.ok) {
        const data = await res.json();
        setShippingRates(data.rates || []);
        setPodProviderName(data.provider || 'prodigi');
        if (data.rates && data.rates.length > 0) {
          setSelectedRateId(data.rates[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch shipping rates:', err);
    } finally {
      setIsLoadingRates(false);
    }
  };

  useEffect(() => {
    fetchShippingRates(address.country_code);
  }, [address.country_code, subtotal]);

  const selectedRate = shippingRates.find(r => r.id === selectedRateId) || shippingRates[0];
  const shippingCost = selectedRate ? selectedRate.amount : 4.95;
  const grandTotal = Number((subtotal + shippingCost).toFixed(2));

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setAddress(prev => ({ ...prev, country_code: newCountry }));
    fetchShippingRates(newCountry);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!customerEmail || !customerName || !address.address_line1 || !address.city || !address.postal_code) {
      setFormError('Please complete all required shipping address fields.');
      return;
    }

    if (!items || items.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/checkout/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_email: customerEmail,
          customer_name: customerName,
          customer_phone: customerPhone,
          shipping_address: {
            ...address,
            recipient_name: address.recipient_name || customerName
          },
          shipping_rate: selectedRate,
          payment_method_choice: paymentMethod,
          items
        })
      });

      const data = await res.json();

      if (!res.ok || !data.order_id) {
        throw new Error(data.error || 'Failed to initialize order');
      }

      if (data.checkout_url) {
        clearCart();
        window.location.href = data.checkout_url;
        return;
      }

      const confirmRes = await fetch('/api/checkout/confirm-simulated', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: data.order_id,
          payment_method: paymentMethod
        })
      });

      const confirmData = await confirmRes.json();
      if (!confirmRes.ok) {
        throw new Error(confirmData.error || 'Failed to verify payment');
      }

      clearCart();
      onOrderSuccess(data.order_id);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setFormError(err.message || 'Payment processing failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h2 className="font-display font-medium text-2xl text-[#17181C]">No items in your bag</h2>
        <p className="text-xs text-[#17181C]/60">Select an edition before proceeding to checkout.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-5 py-2.5 bg-[#C45A2C] text-white font-medium rounded-sm text-xs"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-14 space-y-8">
      
      <div className="border-b border-[#E4DFD5] pb-5">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Print Dispatch</span>
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Order Checkout &amp; Address
        </h1>
        <p className="text-xs sm:text-sm text-[#17181C]/60 mt-1">
          Each book is printed and bound on demand. Provide the delivery address where your volume should be posted.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact */}
            <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E4DFD5]">
                <span className="font-mono text-xs font-semibold text-[#C45A2C]">01</span>
                <h2 className="font-display font-medium text-base text-[#17181C]">
                  Contact &amp; Delivery Notifications
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Email Address * (Postal tracking link is sent here)
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Sarah Connolly"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Telephone Number (For courier delivery SMS)
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+353 87 123 4567"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Destination Address */}
            <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E4DFD5]">
                <span className="font-mono text-xs font-semibold text-[#C45A2C]">02</span>
                <h2 className="font-display font-medium text-base text-[#17181C]">
                  Postal Shipping Address
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Recipient Name (or Reader's Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.recipient_name}
                    onChange={(e) => setAddress({ ...address, recipient_name: e.target.value })}
                    placeholder="e.g. Sarah Connolly (for Eleanor)"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Street Address Line 1 *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.address_line1}
                    onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                    placeholder="14 Starlight Meadow"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Address Line 2 (Apartment, suite, unit)
                  </label>
                  <input
                    type="text"
                    value={address.address_line2 || ''}
                    onChange={(e) => setAddress({ ...address, address_line2: e.target.value })}
                    placeholder="Apartment 4B"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Town / City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="Dublin"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    County / State / Province
                  </label>
                  <input
                    type="text"
                    value={address.state_or_county || ''}
                    onChange={(e) => setAddress({ ...address, state_or_county: e.target.value })}
                    placeholder="Co. Dublin"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Postal / Eircode / Zip Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.postal_code}
                    onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                    placeholder="D03 F8N2"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">
                    Destination Country *
                  </label>
                  <select
                    value={address.country_code}
                    onChange={handleCountryChange}
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3.5 py-2.5 text-xs font-mono text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
                  >
                    <option value="IE">Ireland (IE)</option>
                    <option value="GB">United Kingdom (GB)</option>
                    <option value="US">United States (US)</option>
                    <option value="DE">Germany (DE)</option>
                    <option value="FR">France (FR)</option>
                    <option value="CA">Canada (CA)</option>
                    <option value="AU">Australia (AU)</option>
                    <option value="NL">Netherlands (NL)</option>
                    <option value="ES">Spain (ES)</option>
                    <option value="IT">Italy (IT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: POD Shipping Rate Selection */}
            <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E4DFD5]">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-[#C45A2C]">03</span>
                  <h2 className="font-display font-medium text-base text-[#17181C]">
                    Postal Rate Options
                  </h2>
                </div>
                <span className="font-mono text-[10px] uppercase text-[#17181C]/50">
                  {podProviderName.toUpperCase()} Lab Quote
                </span>
              </div>

              {isLoadingRates ? (
                <div className="flex items-center justify-center py-6 gap-2 text-xs text-[#17181C]/60">
                  <Loader2 className="w-4 h-4 animate-spin text-[#C45A2C]" />
                  <span>Calculating shipping rates for {address.country_code}...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {shippingRates.map(rate => (
                    <label
                      key={rate.id}
                      className={`flex items-start justify-between p-3.5 rounded-sm border cursor-pointer transition-colors ${
                        selectedRateId === rate.id
                          ? 'border-[#17181C] bg-[#F7F4EE] ring-1 ring-[#17181C]'
                          : 'border-[#E4DFD5] hover:border-[#17181C]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="shippingRate"
                          value={rate.id}
                          checked={selectedRateId === rate.id}
                          onChange={() => setSelectedRateId(rate.id)}
                          className="mt-1 text-[#C45A2C] focus:ring-[#C45A2C]"
                        />
                        <div>
                          <div className="font-medium text-xs text-[#17181C]">
                            {rate.name}
                          </div>
                          <div className="text-[11px] text-[#17181C]/60">
                            {rate.description}
                          </div>
                          <div className="font-mono text-[10px] text-[#17181C]/40 mt-0.5">
                            Estimated: {rate.estimated_days_min}–{rate.estimated_days_max} business days
                          </div>
                        </div>
                      </div>

                      <div className="font-mono text-xs font-medium text-[#17181C]">
                        {rate.amount === 0 ? 'FREE' : `€${rate.amount.toFixed(2)}`}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Step 4: Payment */}
            <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-[#E4DFD5]">
                <span className="font-mono text-xs font-semibold text-[#C45A2C]">04</span>
                <h2 className="font-display font-medium text-base text-[#17181C]">
                  Payment Method
                </h2>
              </div>

              {/* Payment selector tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('stripe')}
                  className={`p-3 rounded-sm border text-center transition-colors flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'stripe'
                      ? 'border-[#17181C] bg-[#F7F4EE] ring-1 ring-[#17181C] text-[#17181C]'
                      : 'border-[#E4DFD5] text-[#17181C]/60 hover:bg-[#F7F4EE]'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Credit Card (Stripe)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 rounded-sm border text-center transition-colors flex items-center justify-center gap-2 text-xs font-medium cursor-pointer ${
                    paymentMethod === 'paypal'
                      ? 'border-[#17181C] bg-[#F7F4EE] ring-1 ring-[#17181C] text-[#17181C]'
                      : 'border-[#E4DFD5] text-[#17181C]/60 hover:bg-[#F7F4EE]'
                  }`}
                >
                  <span className="font-mono font-bold text-xs">P</span>
                  <span>PayPal</span>
                </button>
              </div>

              {/* Card inputs */}
              <div className="p-4 bg-[#F7F4EE] rounded-sm border border-[#E4DFD5] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#17181C]/70">
                  <span className="font-medium text-[#17181C]">Card Credentials</span>
                  <div className="flex items-center gap-1 font-mono text-[10px] text-[#17181C]/50">
                    <Lock className="w-3 h-3" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4242 4242 4242 4242"
                    className="w-full bg-white border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs font-mono text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM / YY"
                    className="w-full bg-white border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs font-mono text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
                  />
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                    placeholder="CVC"
                    className="w-full bg-white border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs font-mono text-[#17181C] focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>

                <p className="font-mono text-[10px] text-[#17181C]/50">
                  Pre-filled with test credentials for sandbox validation. No charges are incurred in preview mode.
                </p>
              </div>

            </div>

          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
            <div className="bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-5">
              <div className="flex items-center justify-between border-b border-[#E4DFD5] pb-3">
                <h2 className="font-display font-medium text-base text-[#17181C]">
                  Order Items ({items.length})
                </h2>
                <span className="font-mono text-[11px] text-[#17181C]/40">Printed on Demand</span>
              </div>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {items.map(item => (
                  <div key={item.variant_id} className="flex gap-3 text-xs border-b border-[#E4DFD5] pb-3">
                    <img
                      src={item.cover_image}
                      alt={item.title}
                      className="w-12 h-16 object-cover rounded-sm border border-[#E4DFD5] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs text-[#17181C] truncate">
                        {item.title}
                      </h4>
                      <p className="text-[#17181C]/60 text-[11px] font-mono">
                        {item.format === 'hardcover' ? 'Hardcover' : 'Paperback'} × {item.quantity}
                      </p>
                      {item.dedication_text && (
                        <p className="text-[10px] text-[#C45A2C] italic truncate mt-0.5">
                          Dedication: "{item.dedication_text}"
                        </p>
                      )}
                      <div className="font-mono font-medium text-[#17181C] mt-1">
                        €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs text-[#17181C]/70 pt-1">
                <div className="flex justify-between">
                  <span>Books subtotal</span>
                  <span className="font-mono font-medium text-[#17181C]">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({selectedRate?.name || 'Standard'})</span>
                  <span className="font-mono font-medium text-[#17181C]">
                    {shippingCost === 0 ? 'FREE' : `€${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT</span>
                  <span className="text-[#17181C]/50 font-mono">Zero-rated (Books)</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E4DFD5] flex justify-between items-baseline">
                <span className="font-display font-medium text-base text-[#17181C]">Total Payable</span>
                <span className="font-mono font-medium text-2xl text-[#17181C]">
                  €{grandTotal.toFixed(2)}
                </span>
              </div>

              {formError && (
                <div className="p-3 bg-[#F7F4EE] border border-[#C45A2C] text-xs text-[#C45A2C] flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#C45A2C] hover:bg-[#AD4B22] disabled:opacity-50 text-white font-medium text-sm rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Routing to Bindery...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Confirm Order · €{grandTotal.toFixed(2)}</span>
                  </>
                )}
              </button>

              <div className="font-mono text-[10px] text-[#17181C]/40 text-center space-y-0.5">
                <p>300DPI print files transmitted directly upon confirmation.</p>
                <p>Tracked carrier dispatch with replacement warranty.</p>
              </div>

            </div>
          </div>

        </div>
      </form>

    </div>
  );
};
