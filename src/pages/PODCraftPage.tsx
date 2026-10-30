import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PODCraftPageProps {
  onNavigate: (path: string) => void;
}

export const PODCraftPage: React.FC<PODCraftPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-16">
      
      {/* Header */}
      <div className="space-y-3 max-w-2xl border-b border-[#E4DFD5] pb-8">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          Fulfillment Architecture
        </span>
        <h1 className="font-display font-medium text-3xl sm:text-5xl text-[#17181C] leading-[1.1]">
          Print-on-Demand Craft &amp; Materials
        </h1>
        <p className="text-sm sm:text-base text-[#17181C]/75 leading-relaxed">
          How our store connects checkout directly to certified regional book binderies without dead inventory, pulp waste, or warehouse delays.
        </p>
      </div>

      {/* 4-Step Technical Workflow */}
      <div className="space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">The Sequence</span>
          <h2 className="font-display font-medium text-2xl text-[#17181C] mt-1">
            From Order to Inscribed Physical Book
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-3">
            <span className="font-mono text-xs font-semibold text-[#C45A2C]">STEP 01</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Order &amp; Inscription
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              Customer selects format (Hardcover or Paperback) and inputs an optional dedication. Stripe verifies card payment and triggers the fulfillment engine.
            </p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-3">
            <span className="font-mono text-xs font-semibold text-[#C45A2C]">STEP 02</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Prepress Assembly
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              Our automated backend merges 300DPI CMYK illustration files with the personalized dedication leaf and submits the payload to the regional print laboratory.
            </p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-3">
            <span className="font-mono text-xs font-semibold text-[#C45A2C]">STEP 03</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Indigo Press &amp; Binding
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              Within 24 to 48 hours, sheets are pressed on 170gsm silk paper, folded into signatures, Smyth-sewn, and bound with scuff-resistant case laminate boards.
            </p>
          </div>

          <div className="bg-white p-5 rounded-sm border border-[#E4DFD5] space-y-3">
            <span className="font-mono text-xs font-semibold text-[#C45A2C]">STEP 04</span>
            <h3 className="font-display font-medium text-base text-[#17181C]">
              Tracked Courier Dispatch
            </h3>
            <p className="text-xs text-[#17181C]/70 leading-relaxed">
              The bindery assigns carrier tracking (An Post / Royal Mail / DHL / FedEx). A webhook notifies our database, and tracking updates are delivered by email.
            </p>
          </div>
        </div>
      </div>

      {/* Materials Comparison Table */}
      <div className="bg-white rounded-sm border border-[#E4DFD5] p-6 sm:p-8 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">Specifications</span>
          <h2 className="font-display font-medium text-2xl text-[#17181C] mt-1">
            Hardcover vs. Paperback Construction
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E4DFD5] font-mono uppercase text-[10px] text-[#17181C]/50">
                <th className="pb-3">Component</th>
                <th className="pb-3">Casebound Hardcover</th>
                <th className="pb-3">Softcover Paperback</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DFD5] text-[#17181C]/80">
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Cover Board</td>
                <td>3.0mm rigid greyboard, case-laminated</td>
                <td>300gsm flexible card stock</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Surface Finish</td>
                <td>Scuff-resistant matte soft-touch laminate</td>
                <td>Satin silk protective wipeable coating</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Text Interior Paper</td>
                <td>170gsm Heavyweight Silk (FSC Certified)</td>
                <td>170gsm Heavyweight Silk (FSC Certified)</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Book Block Binding</td>
                <td>Smyth-sewn signatures glued into spine</td>
                <td>Milled polyurethane reactive (PUR) spine glue</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Dedication Leaf</td>
                <td>Typeset on page 1 of book block</td>
                <td>Typeset on page 1 of book block</td>
              </tr>
              <tr>
                <td className="py-3 font-medium text-[#17181C]">Intended Use</td>
                <td>Enduring bedtime reading &amp; family gifts</td>
                <td>Everyday reading, classrooms, travel</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-[#E4DFD5] pt-10 text-center space-y-4">
        <h3 className="font-display font-medium text-2xl text-[#17181C]">
          Explore the Children's Titles Currently in Print
        </h3>
        <div>
          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-3.5 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
};
