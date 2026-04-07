import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle, Phone, Share2, X, Link as LinkIcon, Facebook } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickMenu = () => {
  const { data } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('링크가 복사되었습니다.');
    setShowShareOptions(false);
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    setShowShareOptions(false);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 hidden lg:flex flex-col items-end gap-4">
      {/* Floating Phone Label */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white px-4 py-3 rounded-2xl shadow-2xl border border-gray-100 mb-2 flex items-center gap-3 hover:scale-105 transition-transform cursor-pointer"
          onClick={() => window.location.href = `tel:${data.quickMenu.phone}`}
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: data.themeColor }}>
            <Phone className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-medium leading-none mb-1">분양문의/상담예약</span>
            <span className="text-lg font-black text-gray-900 leading-none">{data.representativePhone}</span>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-3 mb-2"
          >
            {/* Kakao Button */}
            <a
              href={data.quickMenu.kakaoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#FEE500] text-[#3C1E1E] px-4 py-3 rounded-2xl shadow-xl font-bold hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span>카카오톡 상담</span>
            </a>

            {/* Phone Button */}
            <a
              href={`tel:${data.representativePhone}`}
              className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-xl font-bold hover:scale-105 transition-transform border border-gray-100"
            >
              <Phone className="w-5 h-5" style={{ color: data.themeColor }} />
              <span>전화 상담문의</span>
            </a>

            {/* Share Button */}
            <div className="relative">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className="flex items-center gap-3 bg-white text-gray-900 px-4 py-3 rounded-2xl shadow-xl font-bold hover:scale-105 transition-transform border border-gray-100 w-full"
              >
                <Share2 className="w-5 h-5 text-blue-500" />
                <span>공유하기</span>
              </button>

              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute right-full mr-3 top-0 bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex gap-2"
                  >
                    <button
                      onClick={handleCopyLink}
                      className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-gray-600"
                      title="URL 복사"
                    >
                      <LinkIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleShareFacebook}
                      className="p-3 hover:bg-gray-50 rounded-xl transition-colors text-blue-600"
                      title="페이스북 공유"
                    >
                      <Facebook className="w-5 h-5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: data.themeColor }}
      >
        {isOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </button>
    </div>
  );
};
