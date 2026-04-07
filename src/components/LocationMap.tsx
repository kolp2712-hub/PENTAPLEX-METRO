import React from 'react';
import { useSite } from '../context/SiteContext';
import * as LucideIcons from 'lucide-react';
import { MapPin, Navigation } from 'lucide-react';
import { motion } from 'motion/react';

export const LocationMap = () => {
  const { data } = useSite();

  return (
    <section id="location" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
            {data.locationTitle}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            {data.locationSubtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 flex flex-col gap-8">
            {(data.locationMaps || []).map((map, i) => (
              <div key={i} className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                <img
                  src={map}
                  alt={`Location Map ${i + 1}`}
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                {i === 0 && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="p-3 rounded-full shadow-lg"
                      style={{ backgroundColor: data.themeColor }}
                    >
                      <MapPin className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-8">
            {data.locationFeatures?.map((feature) => {
              const Icon = (LucideIcons as any)[feature.icon] || Navigation;
              return (
                <div key={feature.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-50" style={{ color: data.themeColor }}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold">{feature.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}

            <a
              href={data.locationMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 rounded-xl text-white font-bold transition-all hover:opacity-90 text-center block"
              style={{ backgroundColor: data.themeColor }}
            >
              {data.locationButtonText}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
