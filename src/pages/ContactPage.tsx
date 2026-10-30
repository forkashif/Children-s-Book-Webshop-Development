import React, { useState } from 'react';
import { Mail, MapPin, Send, Check } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-16 space-y-12">
      
      <div className="border-b border-[#E4DFD5] pb-6 space-y-2">
        <span className="font-mono text-xs uppercase tracking-wider text-[#C45A2C]">
          Publisher Enquiries
        </span>
        <h1 className="font-display font-medium text-3xl sm:text-4xl text-[#17181C]">
          Contact Starlight Press
        </h1>
        <p className="text-xs sm:text-sm text-[#17181C]/70">
          Reach our editorial and order fulfillment desk in Dublin regarding printed orders, school bulk enquiries, or custom inscriptions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Info Column */}
        <div className="md:col-span-5 bg-white p-6 rounded-sm border border-[#E4DFD5] space-y-6">
          <h2 className="font-display font-medium text-base text-[#17181C]">
            Direct Contact
          </h2>

          <div className="space-y-4 text-xs text-[#17181C]/80">
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[#C45A2C] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#17181C] block">Editorial &amp; Reader Support</span>
                <a href="mailto:desk@starlightpress.ie" className="hover:underline text-[#C45A2C] font-mono">
                  desk@starlightpress.ie
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#C45A2C] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#17181C] block">Publishing Office</span>
                <span>Starlight Press Ltd.<br />14 Clontarf Road, Dublin 3, Ireland</span>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E4DFD5] text-[11px] text-[#17181C]/60">
              Inquiries are answered within one business day Monday through Friday.
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7 bg-white p-6 rounded-sm border border-[#E4DFD5]">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 mx-auto bg-[#17181C] text-white rounded-full flex items-center justify-center">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="font-display font-medium text-lg text-[#17181C]">
                Message Received
              </h3>
              <p className="text-xs text-[#17181C]/70 max-w-sm mx-auto">
                Thank you, {name}. A member of our editorial desk will reply to <strong>{email}</strong> shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-mono uppercase tracking-wider text-[#C45A2C] hover:underline pt-2 cursor-pointer"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Connolly"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-[#17181C]">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="sarah@example.ie"
                    className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#17181C]">Order Number (If applicable)</label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. ST-2026-9042"
                  className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm px-3 py-2 text-xs font-mono text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-medium text-[#17181C]">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your inquiry..."
                  className="w-full bg-[#F7F4EE] border border-[#E4DFD5] rounded-sm p-3 text-xs text-[#17181C] placeholder-[#17181C]/40 focus:outline-none focus:border-[#C45A2C]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#C45A2C] hover:bg-[#AD4B22] text-white font-medium text-xs uppercase tracking-wider rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Note to Publisher</span>
              </button>
            </form>
          )}
        </div>

      </div>

    </div>
  );
};
