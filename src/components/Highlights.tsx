import React from 'react';
import { useSite } from '../context/SiteContext';
import * as LucideIcons from 'lucide-react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export const Highlights = () => {
  const { data } = useSite();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
            {data.highlightsTitle}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            {data.highlightsSubtitle}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.highlights?.map((item, index) => {
            const Icon = (LucideIcons as any)[item.icon] || MapPin;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl border border-gray-100 hover:shadow-xl transition-all group"
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors group-hover:bg-opacity-20"
                  style={{ backgroundColor: `${data.themeColor}10`, color: data.themeColor }}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-500 leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
