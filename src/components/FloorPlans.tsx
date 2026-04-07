import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2 } from 'lucide-react';

export const FloorPlans = () => {
  const { data } = useSite();
  const [activeTab, setActiveTab] = useState(data.floorPlans[0]?.id);

  const activePlan = data.floorPlans.find(p => p.id === activeTab);

  return (
    <section id="floorplans" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
            {data.floorPlansTitle}
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
            {data.floorPlansSubtitle}
          </h3>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {data.floorPlans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setActiveTab(plan.id)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeTab === plan.id
                  ? 'text-white shadow-lg'
                  : 'bg-white text-gray-500 hover:bg-gray-100'
              }`}
              style={activeTab === plan.id ? { backgroundColor: data.themeColor } : {}}
            >
              {plan.type}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activePlan && (
            <motion.div
              key={activePlan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-gray-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <div className="flex flex-col gap-8">
                  {(activePlan.images || []).map((img, i) => (
                    <div key={i} className="relative group rounded-xl overflow-hidden shadow-lg">
                      <img
                        src={img}
                        alt={`${activePlan.type} - ${i + 1}`}
                        className="w-full h-auto"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-10 h-10 text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-8">
                  <div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-4">{activePlan.type}</h4>
                    <p className="text-lg text-gray-500 leading-relaxed">
                      {activePlan.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {activePlan.details?.map((detail, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-gray-50">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">{detail.label}</span>
                        <span className="text-xl font-bold text-gray-900">{detail.value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    className="w-full py-4 rounded-xl border-2 font-bold transition-all hover:bg-gray-50"
                    style={{ borderColor: data.themeColor, color: data.themeColor }}
                  >
                    E-모델하우스 보기
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
