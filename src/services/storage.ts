import { AppPreferences, RecommendationResult, UserNotification } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'fertilizer_ai_prefs',
  FAVORITES_CROPS: 'fertilizer_ai_fav_crops',
  FAVORITES_FERT: 'fertilizer_ai_fav_fert',
  FAVORITES_ARTICLES: 'fertilizer_ai_fav_articles',
  FAVORITES_RECS: 'fertilizer_ai_fav_recs',
  HISTORY: 'fertilizer_ai_history',
  NOTIFICATIONS: 'fertilizer_ai_notifications',
  FORM_DRAFT: 'fertilizer_ai_advisor_draft',
};

const DEFAULT_PREFERENCES: AppPreferences = {
  theme: 'dark',
  language: 'en',
  infoMode: 'simple',
  accessibility: {
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    largeTouchTargets: false,
  },
};

export const StorageService = {
  getPreferences(): AppPreferences {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return data ? { ...DEFAULT_PREFERENCES, ...JSON.parse(data) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  },

  savePreferences(prefs: Partial<AppPreferences>): AppPreferences {
    const current = this.getPreferences();
    const updated = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    return updated;
  },

  // User-scoped Favorite Recommendations
  getUserFavoriteRecommendations(uid?: string | null): RecommendationResult[] {
    try {
      const key = uid ? `${STORAGE_KEYS.FAVORITES_RECS}_${uid}` : STORAGE_KEYS.FAVORITES_RECS;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  saveUserFavoriteRecommendation(rec: RecommendationResult, uid?: string | null): RecommendationResult[] {
    const favs = this.getUserFavoriteRecommendations(uid);
    const filtered = favs.filter((item) => item.id !== rec.id);
    const updated = [rec, ...filtered];
    const key = uid ? `${STORAGE_KEYS.FAVORITES_RECS}_${uid}` : STORAGE_KEYS.FAVORITES_RECS;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  deleteUserFavoriteRecommendation(recId: string, uid?: string | null): RecommendationResult[] {
    const favs = this.getUserFavoriteRecommendations(uid);
    const updated = favs.filter((item) => item.id !== recId);
    const key = uid ? `${STORAGE_KEYS.FAVORITES_RECS}_${uid}` : STORAGE_KEYS.FAVORITES_RECS;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  // User-scoped Crops, Fertilizers, Articles
  getUserFavoriteCrops(uid?: string | null): string[] {
    try {
      const key = uid ? `${STORAGE_KEYS.FAVORITES_CROPS}_${uid}` : STORAGE_KEYS.FAVORITES_CROPS;
      return JSON.parse(localStorage.getItem(key) || '["wheat", "tomato"]');
    } catch {
      return ['wheat', 'tomato'];
    }
  },

  saveUserFavoriteCrops(crops: string[], uid?: string | null): void {
    const key = uid ? `${STORAGE_KEYS.FAVORITES_CROPS}_${uid}` : STORAGE_KEYS.FAVORITES_CROPS;
    localStorage.setItem(key, JSON.stringify(crops));
  },

  getUserFavoriteFertilizers(uid?: string | null): string[] {
    try {
      const key = uid ? `${STORAGE_KEYS.FAVORITES_FERT}_${uid}` : STORAGE_KEYS.FAVORITES_FERT;
      return JSON.parse(localStorage.getItem(key) || '["urea", "dap"]');
    } catch {
      return ['urea', 'dap'];
    }
  },

  saveUserFavoriteFertilizers(ferts: string[], uid?: string | null): void {
    const key = uid ? `${STORAGE_KEYS.FAVORITES_FERT}_${uid}` : STORAGE_KEYS.FAVORITES_FERT;
    localStorage.setItem(key, JSON.stringify(ferts));
  },

  getUserFavoriteArticles(uid?: string | null): string[] {
    try {
      const key = uid ? `${STORAGE_KEYS.FAVORITES_ARTICLES}_${uid}` : STORAGE_KEYS.FAVORITES_ARTICLES;
      return JSON.parse(localStorage.getItem(key) || '["understanding-npk-ratios"]');
    } catch {
      return ['understanding-npk-ratios'];
    }
  },

  saveUserFavoriteArticles(articles: string[], uid?: string | null): void {
    const key = uid ? `${STORAGE_KEYS.FAVORITES_ARTICLES}_${uid}` : STORAGE_KEYS.FAVORITES_ARTICLES;
    localStorage.setItem(key, JSON.stringify(articles));
  },

  getFavoriteCrops(): string[] {
    return this.getUserFavoriteCrops(null);
  },

  toggleFavoriteCrop(cropId: string): string[] {
    const current = this.getFavoriteCrops();
    const updated = current.includes(cropId)
      ? current.filter((id) => id !== cropId)
      : [...current, cropId];
    this.saveUserFavoriteCrops(updated, null);
    return updated;
  },

  getFavoriteFertilizers(): string[] {
    return this.getUserFavoriteFertilizers(null);
  },

  toggleFavoriteFertilizer(fertId: string): string[] {
    const current = this.getFavoriteFertilizers();
    const updated = current.includes(fertId)
      ? current.filter((id) => id !== fertId)
      : [...current, fertId];
    this.saveUserFavoriteFertilizers(updated, null);
    return updated;
  },

  getFavoriteArticles(): string[] {
    return this.getUserFavoriteArticles(null);
  },

  toggleFavoriteArticle(articleId: string): string[] {
    const current = this.getFavoriteArticles();
    const updated = current.includes(articleId)
      ? current.filter((id) => id !== articleId)
      : [...current, articleId];
    this.saveUserFavoriteArticles(updated, null);
    return updated;
  },

  getUserHistory(uid?: string | null): RecommendationResult[] {
    try {
      const key = uid ? `${STORAGE_KEYS.HISTORY}_${uid}` : STORAGE_KEYS.HISTORY;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch {
      return [];
    }
  },

  saveUserRecommendation(rec: RecommendationResult, uid?: string | null): RecommendationResult[] {
    const history = this.getUserHistory(uid);
    const filtered = history.filter((item) => item.id !== rec.id);
    const updated = [rec, ...filtered];
    const key = uid ? `${STORAGE_KEYS.HISTORY}_${uid}` : STORAGE_KEYS.HISTORY;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  deleteUserRecommendation(id: string, uid?: string | null): RecommendationResult[] {
    const history = this.getUserHistory(uid);
    const updated = history.filter((item) => item.id !== id);
    const key = uid ? `${STORAGE_KEYS.HISTORY}_${uid}` : STORAGE_KEYS.HISTORY;
    localStorage.setItem(key, JSON.stringify(updated));
    return updated;
  },

  clearUserHistory(uid?: string | null): void {
    const key = uid ? `${STORAGE_KEYS.HISTORY}_${uid}` : STORAGE_KEYS.HISTORY;
    localStorage.removeItem(key);
  },

  getHistory(): RecommendationResult[] {
    return this.getUserHistory(null);
  },

  saveRecommendation(rec: RecommendationResult): RecommendationResult[] {
    return this.saveUserRecommendation(rec, null);
  },

  deleteRecommendation(id: string): RecommendationResult[] {
    return this.deleteUserRecommendation(id, null);
  },

  clearHistory(): void {
    this.clearUserHistory(null);
  },

  getNotifications(): UserNotification[] {
    const INITIAL_NOTIFICATIONS: UserNotification[] = [
      {
        id: 'n1',
        title: '🌱 Soil Advisory Ready',
        message: 'Your soil analysis for Wheat has been calculated with 94% confidence match.',
        timestamp: '10 minutes ago',
        read: false,
        type: 'success',
      },
      {
        id: 'n2',
        title: '🌾 Season Update',
        message: 'Rabi sowing season optimal window begins this week in north & western agricultural belts.',
        timestamp: '2 hours ago',
        read: false,
        type: 'info',
      },
      {
        id: 'n3',
        title: '💡 Agritech Insight Added',
        message: 'New article available: Soil pH and Nutrient Availability.',
        timestamp: '1 day ago',
        read: true,
        type: 'info',
      },
    ];

    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return data ? JSON.parse(data) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  },

  markNotificationRead(id: string): UserNotification[] {
    const current = this.getNotifications();
    const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  markAllNotificationsRead(): UserNotification[] {
    const current = this.getNotifications();
    const updated = current.map((n) => ({ ...n, read: true }));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return updated;
  },

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },
};
