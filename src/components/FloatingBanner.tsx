import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

export const FloatingBanner = () => {
  const { data } = useSite();
  const banner = data.floatingBanner || {
    line1: "모델하우스 방문예약 접수중",
    line2: "입주시까지 0원 파격조건",
    phone: data.representativePhone,
    show: true
  };
  const phone = banner.phone || data.representativePhone;

  if (!banner.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] hidden lg:flex"
    >
      <a
        href={`tel:${phone}`}
        className="relative quick-admin-banner flex items-stretch bg-[#6B0024] border-[4px] border-[#FFD700] rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all duration-300"
      >
        {/* Shimmer Effect Overlay */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="w-1/2 h-full bg-white/20 blur-xl animate-shimmer" />
        </div>

        {/* Line 1: White Vertical Text with Pill Background */}
        <div className="px-3 py-6 flex flex-col items-center justify-center border-r border-white/10 bg-[#4A0019]">
          <div className="bg-white px-1.5 py-4 rounded-full flex items-center justify-center">
            <span className="text-[#6B0024] font-black text-base [writing-mode:vertical-rl] tracking-tighter leading-none">
              {banner.line1}
            </span>
          </div>
        </div>

        {/* Line 2: Yellow Vertical Text with Star */}
        <div className="px-3 py-6 flex flex-col items-center justify-center border-r border-white/10 gap-2">
          <Star className="w-4 h-4 text-[#FFD700] fill-[#FFD700] animate-pulse" />
          <span className="text-[#FFD700] font-black text-lg [writing-mode:vertical-rl] tracking-widest drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            {banner.line2}
          </span>
        </div>

        {/* Line 3: Teal/Green Box with Large White Vertical Text */}
        <div className="px-4 py-6 bg-[#004D40] flex flex-col items-center justify-center gap-2 relative">
          <span className="text-white/70 text-[10px] [writing-mode:vertical-rl] font-bold mb-1">대표상담전화</span>
          <span className="text-white font-black text-2xl [writing-mode:vertical-rl] tracking-tighter drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]">
            {phone}
          </span>
          {/* Sparkle Dot */}
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </div>
      </a>
    </motion.div>
  );
};
