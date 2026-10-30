import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      q: "Are these physical printed books or digital downloads?",
      a: "Every volume we offer is a physical printed book. We do not sell PDFs, eBooks, or digital files. Orders are individually bound on demand as casebound hardcovers or heavy silk paperbacks."
    },
    {
      q: "How is the personalized dedication leaf printed?",
      a: "During checkout, you can supply a custom inscription for the child. Our automated prepress system sets your text in classical serif italics directly onto page one (the opening right-hand leaf) before the book block is sewn and cased."
    },
    {
      q: "What paper stock and bindery methods are used?",
      a: "We specify 170gsm silk paper certified by the Forest Stewardship Council (FSC). This heavyweight stock prevents ink transparency from back-to-back full-colour spreads. Hardcovers are Smyth-sewn into 3mm greyboard cases; paperbacks use PUR adhesive binding."
    },
    {
      q: "What are the production and delivery lead times?",
      a: "Because each book is individually manufactured, printing requires 24 to 48 business hours. Tracked postal transit takes 2–4 business days within Ireland and the UK, 3–6 business days in the European Union, and 4–7 business days in North America."
    },
    {
      q: "What happens if a book is damaged in postal transit?",
      a: "We provide an unconditional replacement guarantee. If a parcel is damaged by the carrier, email a photograph to desk@starlightpress.ie and an identical new copy will be ordered and dispatched without charge."
    },
    {
      q: "Can I inspect real-time tracking for my parcel?",
      a: "Yes. Use our Track Order tool with your order reference number (e.g., ST-2026-9042) and email address to view bindery status, carrier tracking codes, and delivery milestones."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-8">
      
      <div className="border-b border-[#E4DFD5] pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          Publisher Reference
        </span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#17181C]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-[#17181C]/70">
          Details on print specifications, typeset dedications, on-demand fulfillment, and carrier timelines.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-sm border border-[#E4DFD5] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-display font-medium text-sm sm:text-base text-[#17181C] hover:text-[#C45A2C] transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#C45A2C] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#17181C]/40 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#17181C]/75 leading-relaxed border-t border-[#E4DFD5] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
