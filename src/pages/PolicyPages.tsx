import React from 'react';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 text-xs sm:text-sm text-[#17181C]/80 leading-relaxed">
      <div className="border-b border-[#E4DFD5] pb-4 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Policy Document</span>
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Shipping &amp; Replacement Policy
        </h1>
        <p className="font-mono text-[11px] text-[#17181C]/50">
          Last revised: January 2026 · Starlight Press Ltd.
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">1. Print-on-Demand Production Sequence</h2>
        <p>
          Every book sold by Starlight Press is printed individually upon order placement. Because your custom inscription is typeset on page 1 before sewing and casing, manufacturing takes <strong>24 to 48 business hours</strong> before handover to the postal carrier.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">2. Carrier Lead Times &amp; Standard Rates</h2>
        <p>Orders are dispatched from accredited print facilities in Ireland, the UK, the EU, or the US to minimize transit distance:</p>
        <ul className="list-disc pl-5 space-y-1 font-mono text-xs text-[#17181C]/70">
          <li>Ireland &amp; UK: Standard tracked (2–4 business days) from €3.95</li>
          <li>European Union: Standard tracked (3–6 business days) from €5.95</li>
          <li>United States &amp; Canada: Standard tracked (4–7 business days) from €6.95</li>
          <li>International: Standard tracked (5–10 business days) from €8.95</li>
        </ul>
        <p className="font-mono text-xs text-[#C45A2C]">
          Standard tracked shipping is complimentary on all orders with a subtotal of €45.00 or greater.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">3. Damage &amp; Misprint Warranty</h2>
        <p>
          Because books are custom printed with personalized text, general returns are not accepted. However, if a book arrives damaged in transit or possesses a bindery defect, we will reprint and dispatch a replacement copy at zero cost. Email photograph documentation to <a href="mailto:desk@starlightpress.ie" className="text-[#C45A2C] underline">desk@starlightpress.ie</a> within 30 days of delivery.
        </p>
      </section>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 text-xs sm:text-sm text-[#17181C]/80 leading-relaxed">
      <div className="border-b border-[#E4DFD5] pb-4 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Data Governance</span>
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Privacy Policy
        </h1>
        <p className="font-mono text-[11px] text-[#17181C]/50">
          GDPR (EU) &amp; UK Data Protection Act Compliant
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">1. Data Collected for Fulfillment</h2>
        <p>
          We collect your name, email address, postal shipping address, phone number (for courier delivery notifications), and the dedication text submitted for typesetting.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">2. Payment Processing</h2>
        <p>
          Payment cards are processed through PCI-DSS Level 1 compliant gateway partners (Stripe and PayPal). Full credit card numbers and security codes never touch our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">3. Manufacturing Subcontracting</h2>
        <p>
          To print and dispatch your book, order payloads (including postal address and dedication inscription) are securely transmitted via encrypted API to our accredited print network partners (Prodigi Group) and postal couriers.
        </p>
      </section>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8 text-xs sm:text-sm text-[#17181C]/80 leading-relaxed">
      <div className="border-b border-[#E4DFD5] pb-4 space-y-1">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Legal Conditions</span>
        <h1 className="font-display font-medium text-3xl text-[#17181C]">
          Terms &amp; Conditions of Sale
        </h1>
        <p className="font-mono text-[11px] text-[#17181C]/50">
          Starlight Press Ltd. · Registered in Ireland
        </p>
      </div>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">1. Physical Books Exclusively</h2>
        <p>
          Starlight Press sells physical picture books exclusively. Prices are displayed in Euros (€ EUR) and include applicable VAT.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display font-medium text-base text-[#17181C]">2. Inscription Content Standards</h2>
        <p>
          Purchasers bear responsibility for spelling and accuracy of custom inscriptions. We reserve the right to cancel orders containing defamatory, obscene, or infringing material.
        </p>
      </section>
    </div>
  );
};
