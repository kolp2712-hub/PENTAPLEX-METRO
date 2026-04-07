import React from 'react';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Highlights } from '../components/Highlights';
import { Gallery } from '../components/Gallery';
import { LocationMap } from '../components/LocationMap';
import { FloorPlans } from '../components/FloorPlans';
import { Notices } from '../components/Notices';
import { InquiryForm } from '../components/InquiryForm';
import { Footer } from '../components/Footer';
import { QuickMenu } from '../components/QuickMenu';
import { FloatingBanner } from '../components/FloatingBanner';
import { MobileStickyFooter } from '../components/MobileStickyFooter';
import { MobilePopup } from '../components/MobilePopup';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';

const Home = () => {
  const { data, isDataLoaded } = useSite();

  return (
    <>
      <AnimatePresence>
        {!isDataLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000] bg-white flex flex-col items-center justify-center"
          >
            <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-900 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 font-medium animate-pulse">정보를 불러오는 중입니다...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-white pb-20 lg:pb-0" style={{ fontFamily: data.fontFamily }}>
        <Navbar />
        <main>
          <Hero />
          <Highlights />
          <Gallery />
          <LocationMap />
          <FloorPlans />
          <Notices />
          <InquiryForm />
        </main>
        <Footer />
        <QuickMenu />
        <FloatingBanner />
        <MobileStickyFooter />
        <MobilePopup />
      </div>
    </>
  );
};

export default Home;
