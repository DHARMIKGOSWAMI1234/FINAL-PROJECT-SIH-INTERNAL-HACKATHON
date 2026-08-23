import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '../components/dashboard/Sidebar';
import { DashboardHeader } from '../components/dashboard/DashboardHeader';
import { WelcomeBanner } from '../components/dashboard/WelcomeBanner';
import { QuickActions } from '../components/dashboard/QuickActions';
import { AgriculturalOverviewMetrics } from '../components/dashboard/AgriculturalOverviewMetrics';
import { LatestRecommendationCard } from '../components/dashboard/LatestRecommendationCard';
import { SoilHealthWidget } from '../components/dashboard/SoilHealthWidget';
import { RecentAnalysesTable } from '../components/dashboard/RecentAnalysesTable';
import { MyCropsOverview } from '../components/dashboard/MyCropsOverview';
import { AgriculturalInsightsGrid } from '../components/dashboard/AgriculturalInsightsGrid';
import { NotificationsDrawer } from '../components/common/NotificationsDrawer';
import { AIAssistant } from '../components/common/AIAssistant';
import { getDashboardData } from '../services/dashboardService';
import { useCommandPalette } from '../context/CommandPaletteContext';

export const DashboardPage: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { openPalette } = useCommandPalette();

  const dashboardData = getDashboardData();

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#080B0A] text-slate-900 dark:text-warmwhite flex transition-colors duration-300">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px] transition-all">
        {/* Top Header */}
        <DashboardHeader
          onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
          onOpenSearch={openPalette}
          onOpenNotifications={() => setShowNotifications(!showNotifications)}
        />

        {/* Notifications Dropdown Container */}
        {showNotifications && (
          <div className="relative z-40 px-4 sm:px-8 pt-2">
            <NotificationsDrawer />
          </div>
        )}

        {/* Dashboard Main Viewport */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full"
        >
          {/* Welcome Banner */}
          <WelcomeBanner />

          {/* Quick Action Tiles */}
          <QuickActions />

          {/* Agricultural Overview Metrics */}
          <AgriculturalOverviewMetrics metrics={dashboardData.metrics} />

          {/* Primary Split: Latest AI Recommendation & Soil Health */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <LatestRecommendationCard data={dashboardData.latestRecommendation} />
            </div>
            <div className="lg:col-span-5">
              <SoilHealthWidget data={dashboardData.soilHealth} />
            </div>
          </div>

          {/* Recent Analyses Log */}
          <RecentAnalysesTable items={dashboardData.recentAnalyses} />

          {/* Saved Crops & Insights Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <MyCropsOverview crops={dashboardData.myCrops} />
            </div>
            <div className="lg:col-span-7">
              <AgriculturalInsightsGrid insights={dashboardData.latestInsights} />
            </div>
          </div>
        </motion.main>
      </div>

      {/* 3. Floating AI Assistant Orb & Drawer */}
      <AIAssistant />
    </div>
  );
};
