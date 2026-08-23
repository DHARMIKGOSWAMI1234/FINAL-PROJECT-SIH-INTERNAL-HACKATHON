import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { RecommendationResult } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favoriteRecommendations: RecommendationResult[];
  favoriteCrops: string[];
  favoriteFertilizers: string[];
  favoriteArticles: string[];
  loading: boolean;
  toggleRecommendation: (rec: RecommendationResult) => Promise<void>;
  toggleCrop: (cropId: string) => Promise<void>;
  toggleFertilizer: (fertId: string) => Promise<void>;
  toggleArticle: (articleId: string) => Promise<void>;
  isRecFav: (recId: string) => boolean;
  isCropFav: (cropId: string) => boolean;
  isFertFav: (fertId: string) => boolean;
  isArticleFav: (articleId: string) => boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [favoriteRecommendations, setFavoriteRecommendations] = useState<RecommendationResult[]>([]);
  const [favoriteCrops, setFavoriteCrops] = useState<string[]>([]);
  const [favoriteFertilizers, setFavoriteFertilizers] = useState<string[]>([]);
  const [favoriteArticles, setFavoriteArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const activeUidRef = useRef<string | null>(null);
  const inFlightRecRef = useRef<Set<string>>(new Set());

  // Load favorites when auth state resolves or user switches
  const loadUserFavorites = useCallback(async () => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    const currentUid = user?.uid || null;

    // Clear stale state immediately on account switch
    if (activeUidRef.current !== currentUid) {
      activeUidRef.current = currentUid;
      setFavoriteRecommendations([]);
      setFavoriteCrops([]);
      setFavoriteFertilizers([]);
      setFavoriteArticles([]);
    }

    setLoading(true);

    if (currentUid) {
      // 1. Load user-scoped cache for zero-latency initial view
      const cachedRecs = StorageService.getUserFavoriteRecommendations(currentUid);
      const cachedCrops = StorageService.getUserFavoriteCrops(currentUid);
      const cachedFerts = StorageService.getUserFavoriteFertilizers(currentUid);
      const cachedArticles = StorageService.getUserFavoriteArticles(currentUid);

      setFavoriteRecommendations(cachedRecs);
      setFavoriteCrops(cachedCrops);
      setFavoriteFertilizers(cachedFerts);
      setFavoriteArticles(cachedArticles);

      // 2. Fetch authoritative favorites from Cloud Firestore
      try {
        const [firestoreRecs, firestoreFavs] = await Promise.all([
          FirestoreService.getUserFavoriteRecommendations(currentUid),
          FirestoreService.getUserFavorites(currentUid),
        ]);

        if (firestoreRecs) {
          setFavoriteRecommendations(firestoreRecs);
          localStorage.setItem(
            `fertilizer_ai_fav_recs_${currentUid}`,
            JSON.stringify(firestoreRecs)
          );
        }

        if (firestoreFavs) {
          if (firestoreFavs.crops) {
            setFavoriteCrops(firestoreFavs.crops);
            StorageService.saveUserFavoriteCrops(firestoreFavs.crops, currentUid);
          }
          if (firestoreFavs.fertilizers) {
            setFavoriteFertilizers(firestoreFavs.fertilizers);
            StorageService.saveUserFavoriteFertilizers(firestoreFavs.fertilizers, currentUid);
          }
          if (firestoreFavs.articles) {
            setFavoriteArticles(firestoreFavs.articles);
            StorageService.saveUserFavoriteArticles(firestoreFavs.articles, currentUid);
          }
        }
      } catch (err) {
        console.warn('Failed to load favorites from Firestore, using cached favorites:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest mode
      setFavoriteRecommendations(StorageService.getUserFavoriteRecommendations(null));
      setFavoriteCrops(StorageService.getUserFavoriteCrops(null));
      setFavoriteFertilizers(StorageService.getUserFavoriteFertilizers(null));
      setFavoriteArticles(StorageService.getUserFavoriteArticles(null));
      setLoading(false);
    }
  }, [user?.uid, authLoading]);

  useEffect(() => {
    loadUserFavorites();
  }, [loadUserFavorites]);

  const toggleRecommendation = async (rec: RecommendationResult) => {
    if (!rec || !rec.id) return;

    // Prevent duplicate concurrent toggle writes
    if (inFlightRecRef.current.has(rec.id)) {
      return;
    }
    inFlightRecRef.current.add(rec.id);

    try {
      const currentUid = user?.uid || null;
      const exists = favoriteRecommendations.some((r) => r.id === rec.id);

      if (exists) {
        // Remove from favorites
        setFavoriteRecommendations((prev) => prev.filter((r) => r.id !== rec.id));
        StorageService.deleteUserFavoriteRecommendation(rec.id, currentUid);

        if (currentUid) {
          try {
            await FirestoreService.deleteFavoriteRecommendation(currentUid, rec.id);
          } catch (err) {
            console.error('Failed to delete favorite recommendation from Firestore:', rec.id, err);
          }
        }
      } else {
        // Add to favorites
        setFavoriteRecommendations((prev) => [rec, ...prev.filter((r) => r.id !== rec.id)]);
        StorageService.saveUserFavoriteRecommendation(rec, currentUid);

        if (currentUid) {
          try {
            await FirestoreService.saveFavoriteRecommendation(currentUid, rec);
          } catch (err) {
            console.error('Failed to save favorite recommendation to Firestore:', rec.id, err);
          }
        }
      }
    } finally {
      inFlightRecRef.current.delete(rec.id);
    }
  };

  const toggleCrop = async (cropId: string) => {
    const currentUid = user?.uid || null;
    const updated = favoriteCrops.includes(cropId)
      ? favoriteCrops.filter((id) => id !== cropId)
      : [...favoriteCrops, cropId];

    setFavoriteCrops(updated);
    StorageService.saveUserFavoriteCrops(updated, currentUid);

    if (currentUid) {
      try {
        await FirestoreService.saveUserFavorites(currentUid, {
          crops: updated,
          fertilizers: favoriteFertilizers,
          articles: favoriteArticles,
        });
      } catch (err) {
        console.error('Failed to persist crop favorite to Firestore:', cropId, err);
      }
    }
  };

  const toggleFertilizer = async (fertId: string) => {
    const currentUid = user?.uid || null;
    const updated = favoriteFertilizers.includes(fertId)
      ? favoriteFertilizers.filter((id) => id !== fertId)
      : [...favoriteFertilizers, fertId];

    setFavoriteFertilizers(updated);
    StorageService.saveUserFavoriteFertilizers(updated, currentUid);

    if (currentUid) {
      try {
        await FirestoreService.saveUserFavorites(currentUid, {
          crops: favoriteCrops,
          fertilizers: updated,
          articles: favoriteArticles,
        });
      } catch (err) {
        console.error('Failed to persist fertilizer favorite to Firestore:', fertId, err);
      }
    }
  };

  const toggleArticle = async (articleId: string) => {
    const currentUid = user?.uid || null;
    const updated = favoriteArticles.includes(articleId)
      ? favoriteArticles.filter((id) => id !== articleId)
      : [...favoriteArticles, articleId];

    setFavoriteArticles(updated);
    StorageService.saveUserFavoriteArticles(updated, currentUid);

    if (currentUid) {
      try {
        await FirestoreService.saveUserFavorites(currentUid, {
          crops: favoriteCrops,
          fertilizers: favoriteFertilizers,
          articles: updated,
        });
      } catch (err) {
        console.error('Failed to persist article favorite to Firestore:', articleId, err);
      }
    }
  };

  const isRecFav = (recId: string) => favoriteRecommendations.some((r) => r.id === recId);
  const isCropFav = (cropId: string) => favoriteCrops.includes(cropId);
  const isFertFav = (fertId: string) => favoriteFertilizers.includes(fertId);
  const isArticleFav = (articleId: string) => favoriteArticles.includes(articleId);

  const refreshFavorites = async () => {
    await loadUserFavorites();
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteRecommendations,
        favoriteCrops,
        favoriteFertilizers,
        favoriteArticles,
        loading,
        toggleRecommendation,
        toggleCrop,
        toggleFertilizer,
        toggleArticle,
        isRecFav,
        isCropFav,
        isFertFav,
        isArticleFav,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};
