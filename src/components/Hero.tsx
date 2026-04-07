import React from 'react';
import { motion } from 'motion/react';
import { useSite } from '../context/SiteContext';
import { ChevronDown } from 'lucide-react';

export const Hero = () => {
  const { data } = useSite();

  return (
    <section className="relative w-full overflow-hidden">
      <div className="flex flex-col">
        {(data.heroImages || []).map((img, i) => (
          <div key={i} className="relative h-screen w-full">
            <img
              src={img}
              alt={`Vista Dongwon Hero ${i + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading={i === 0 ? "eager" : "lazy"}
            />
            {i === 0 && (
              <>
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                  >
                    <h2 className="text-lg md:text-xl font-medium text-white/90 tracking-[0.2em] uppercase">
                      {data.title}
                    </h2>
                    <h1 className="text-4xl md:text-7xl font-bold text-white leading-tight">
                      {data.heroSlogan.split(' ').map((word, i) => (
                        <span key={i} className="inline-block mr-4">
                          {word}
                        </span>
                      ))}
                    </h1>
                    <p className="text-lg md:text-2xl text-white/80 font-light max-w-3xl mx-auto">
                      {data.heroDescription}
                    </p>

                    <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href="#inquiry"
                        className="inline-block px-10 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all transform hover:scale-105"
                      >
                        {data.heroButtonText}
                      </a>
                      <a
                        href={data.eModelHouseUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-10 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition-all transform hover:scale-105"
                      >
                        e-모델하우스 보기
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
                  >
                    <ChevronDown className="w-8 h-8" />
                  </motion.div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
