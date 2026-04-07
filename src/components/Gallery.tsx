import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';

export const Gallery = () => {
  const { data } = useSite();

  return (
    <section id="gallery" className="py-24 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
              {data.galleryTitle}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              {data.gallerySubtitle}
            </h3>
          </div>
          <p className="text-gray-500 md:max-w-xs">
            {data.galleryDescription}
          </p>
        </div>
 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data.galleryImages || []).map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg bg-gray-200"
            >
              <img
                src={img}
                alt={`Gallery ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
