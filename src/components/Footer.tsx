import React from 'react';
import { useSite } from '../context/SiteContext';
import { Facebook, Instagram, Youtube, Phone } from 'lucide-react';

export const Footer = () => {
  const { data } = useSite();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#333333] text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors" onClick={scrollToTop}>
              {data.title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {data.heroSlogan}
            </p>
            <div className="flex gap-4">
              <Facebook className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
              <Youtube className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">분양정보</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><a href="#gallery" className="hover:text-white">단지안내</a></li>
              <li><a href="#location" className="hover:text-white">입지환경</a></li>
              <li><a href="#floorplans" className="hover:text-white">평면안내</a></li>
              <li><a href="#inquiry" className="hover:text-white">상담예약</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">사업개요</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>시행: {data.footerInfo.developer}</li>
              <li>시공: {data.footerInfo.constructor}</li>
              <li>현장: {data.footerInfo.address}</li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider mb-6">분양문의</h4>
            <div className="flex items-center gap-3 text-2xl font-bold" style={{ color: data.themeColor }}>
              <Phone className="w-6 h-6" />
              {data.representativePhone}
            </div>
            <p className="text-xs text-gray-500 mt-4">
              ※ 본 사이트의 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-16 pt-8 text-center text-xs text-gray-500">
          {data.footerCopyright}
        </div>
      </div>
    </footer>
  );
};
