import React from 'react';
import { useSite } from '../context/SiteContext';
import { MessageSquare, Phone } from 'lucide-react';

export const MobileStickyFooter = () => {
  const { data } = useSite();
  const phone = data.representativePhone;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] lg:hidden">
      <div className="bg-black/80 backdrop-blur-md px-4 py-3 flex items-center gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.3)]">
        {/* SMS Button */}
        <a
          href={`sms:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#FF4D00] text-white py-3.5 rounded-xl font-bold active:scale-95 transition-transform"
        >
          <div className="bg-white/20 p-1 rounded-lg">
            <MessageSquare className="w-5 h-5 fill-white" />
          </div>
          <span className="text-base">문자상담</span>
        </a>

        {/* Phone Button */}
        <a
          href={`tel:${phone}`}
          className="flex-1 flex items-center justify-center gap-2 bg-[#2ECC71] text-white py-3.5 rounded-xl font-bold active:scale-95 transition-transform"
        >
          <div className="bg-white/20 p-1 rounded-lg">
            <Phone className="w-5 h-5 fill-white" />
          </div>
          <span className="text-base">전화연결</span>
        </a>
      </div>
    </div>
  );
};
