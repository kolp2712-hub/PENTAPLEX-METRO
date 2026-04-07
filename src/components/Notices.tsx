import React from 'react';
import { useSite } from '../context/SiteContext';
import { Bell } from 'lucide-react';

export const Notices = () => {
  const { data } = useSite();

  return (
    <section id="notices" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase mb-4" style={{ color: data.themeColor }}>
              {data.noticesTitle}
            </h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
              {data.noticesSubtitle}
            </h3>
          </div>
          <button className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors">
            전체보기 +
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {data.notices?.map((notice) => (
            <div
              key={notice.id}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-gray-50 text-gray-400 group-hover:bg-opacity-100 transition-colors" style={{ color: data.themeColor }}>
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                    {notice.title}
                  </h4>
                  <p className="text-sm text-gray-500 line-clamp-1">
                    {notice.content}
                  </p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-400 whitespace-nowrap">
                {notice.date}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
