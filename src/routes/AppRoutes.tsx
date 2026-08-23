import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';
import { AdvisorPage } from '../pages/AdvisorPage';
import { RecommendationPage } from '../pages/RecommendationPage';
import { CropsPage } from '../pages/CropsPage';
import { CropDetailPage } from '../pages/CropDetailPage';
import { FertilizersPage } from '../pages/FertilizersPage';
import { FertilizerDetailPage } from '../pages/FertilizerDetailPage';
import { InsightsPage } from '../pages/InsightsPage';
import { ArticleDetailPage } from '../pages/ArticleDetailPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HistoryPage } from '../pages/HistoryPage';
import { FavoritesPage } from '../pages/FavoritesPage';
import { SettingsPage } from '../pages/SettingsPage';
import { ProfilePage } from '../pages/ProfilePage';
import { AuthPages } from '../pages/AuthPages';
import { AboutPage } from '../pages/AboutPage';
import { AssistantPage } from '../pages/AssistantPage';
import { NotFoundPage } from '../pages/NotFoundPage';

import { ProtectedRoute } from '../components/common/ProtectedRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/advisor" element={<AdvisorPage />} />
      <Route path="/recommendation" element={<RecommendationPage />} />
      <Route path="/recommendation/:id" element={<RecommendationPage />} />
      <Route path="/crops" element={<CropsPage />} />
      <Route path="/crops/:id" element={<CropDetailPage />} />
      <Route path="/crops/:cropId" element={<CropDetailPage />} />
      <Route path="/fertilizers" element={<FertilizersPage />} />
      <Route path="/fertilizers/:id" element={<FertilizerDetailPage />} />
      <Route path="/insights" element={<InsightsPage />} />
      <Route path="/insights/:id" element={<ArticleDetailPage />} />
      <Route path="/insights/:articleId" element={<ArticleDetailPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favorites"
        element={
          <ProtectedRoute>
            <FavoritesPage />
          </ProtectedRoute>
        }
      />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<AuthPages />} />
      <Route path="/signup" element={<AuthPages />} />
      <Route path="/register" element={<AuthPages />} />
      <Route path="/forgot-password" element={<AuthPages />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
