import { useState } from 'react';
import { Calendar, Tag, BarChart3 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { EventManagement } from '../components/admin/EventManagement';
import { PromotionManagement } from '../components/admin/PromotionManagement';
import { ReportsAndCharts } from '../components/admin/ReportsAndCharts';

const TABS = {
  EVENTS: 'events',
  PROMOTIONS: 'promotions',
  REPORTS: 'reports',
};

export const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState(TABS.EVENTS);

  const tabs = [
    {
      id: TABS.EVENTS,
      label: 'Event Management',
      icon: Calendar,
    },
    {
      id: TABS.PROMOTIONS,
      label: 'Promotions',
      icon: Tag,
    },
    {
      id: TABS.REPORTS,
      label: 'Reports',
      icon: BarChart3,
    },
  ];

  return (
    <Layout>
      <div className="flex flex-col md:flex-row gap-6 min-h-[calc(100vh-12rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 flex-shrink-0 bg-white border border-gray-200 rounded-lg p-4 shadow-md h-fit md:sticky md:top-20">
          <div className="mb-6 px-2">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500 mt-1">Management & reports</p>
          </div>
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-x-visible pb-2 md:pb-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-3 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 cursor-pointer text-left w-full whitespace-nowrap
                    ${isActive
                      ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-white border border-gray-200 shadow-md rounded-lg p-6">
            {activeTab === TABS.EVENTS && <EventManagement />}
            {activeTab === TABS.PROMOTIONS && <PromotionManagement />}
            {activeTab === TABS.REPORTS && <ReportsAndCharts />}
          </div>
        </main>
      </div>
    </Layout>
  );
};
