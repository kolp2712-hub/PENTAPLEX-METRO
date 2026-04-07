import React from 'react';
import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import { Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';

export const Navbar = () => {
  const { data } = useSite();
  const [isOpen, setIsOpen] = useState(false);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const navItems = [
    { name: '단지안내', href: '#gallery' },
    { name: '입지환경', href: '#location' },
    { name: '평면안내', href: '#floorplans' },
    { name: '분양소식', href: '#notices' },
    { name: '상담예약', href: '#inquiry' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link to="/" onClick={scrollToTop} className="flex items-center gap-2 shrink-0">
              <span className="text-lg md:text-xl font-bold tracking-tight text-gray-900">{data.title}</span>
            </Link>
          </div>

          {/* Center: Spacer or Title extension */}
          <div className="flex-none" />

          {/* Right: Nav & Admin */}
          <div className="flex-1 flex justify-end items-center gap-4 md:gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <Link
                to="/admin"
                className="px-4 py-2 text-sm font-medium text-white rounded-full transition-all hover:opacity-90"
                style={{ backgroundColor: data.themeColor }}
              >
                관리자
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-base font-medium text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </a>
          ))}
          <Link
            to="/admin"
            className="block py-2 text-base font-medium"
            style={{ color: data.themeColor }}
            onClick={() => setIsOpen(false)}
          >
            관리자
          </Link>
        </div>
      )}
    </nav>
  );
};
