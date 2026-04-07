import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Star, X } from 'lucide-react';

export const MobilePopup = () => {
  const { data } = useSite();
  const [isVisible, setIsVisible] = useState(false);
  const banner = data.floatingBanner;

  useEffect(() => {
    const hideUntil = localStorage.getItem('hideMobilePopupUntil');
    if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
      // Show popup after a short delay
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => setIsVisible(false);

  const hideForToday = () => {
    const tomorrow = new Date();
    tomorrow.setHours(tomorrow.getHours() + 24);
    localStorage.setItem('hideMobilePopupUntil', tomorrow.getTime().toString());
    setIsVisible(false);
  };

  if (!banner || !banner.show) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 lg:hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePopup}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Popup Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-[#6B0024] border-[3px] border-[#FFD700] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
          >
            {/* Header */}
            <div className="bg-[#6B0024] py-4 px-6 text-center border-b border-white/10">
              <h3 className="text-[#FFD700] font-black text-xl tracking-tighter">
                "{data.title}" <br/> 파격조건 분양중!
              </h3>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Line 1: White Pill */}
              <div className="bg-white py-3 px-4 rounded-full text-center shadow-lg">
                <span className="text-[#6B0024] font-black text-lg">
                  {banner.line1}
                </span>
              </div>

              {/* Line 2: Wine Background with Star */}
              <div className="flex items-center justify-center gap-2 py-2">
                <Star className="w-5 h-5 text-[#FFD700] fill-[#FFD700] animate-pulse" />
                <span className="text-[#FFD700] font-black text-xl tracking-tight">
                  {banner.line2}
                </span>
              </div>

              {/* Line 3: Teal Box with Phone */}
              <a
                href={`tel:${banner.phone || data.representativePhone}`}
                className="block bg-[#004D40] p-6 rounded-2xl text-center border border-white/20 shadow-inner group active:scale-95 transition-transform"
              >
                <p className="text-white/70 text-xs font-bold mb-1">모델하우스 24시간 대표상담전화</p>
                <p className="text-white font-black text-4xl tracking-tighter group-hover:scale-105 transition-transform">
                  {banner.phone || data.representativePhone}
                </p>
              </a>
            </div>

            {/* Footer Buttons */}
            <div className="flex border-t border-white/10 bg-black/20">
              <button
                onClick={hideForToday}
                className="flex-1 py-4 text-white/60 text-sm font-medium hover:text-white transition-colors border-r border-white/10"
              >
                오늘 하루 보지 않기
              </button>
              <button
                onClick={closePopup}
                className="flex-1 py-4 text-white text-sm font-bold hover:bg-white/10 transition-colors"
              >
                닫기
              </button>
            </div>

            {/* Close Icon Top Right */}
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 p-2 text-white/50 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
