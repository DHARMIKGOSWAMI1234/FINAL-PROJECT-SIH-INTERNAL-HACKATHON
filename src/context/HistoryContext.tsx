import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { RecommendationResult } from '../types';
import { StorageService } from '../services/storage';
import { FirestoreService } from '../services/firestore';
import { useAuth } from './AuthContext';

interface HistoryContextType {
  history: RecommendationResult[];
  loading: boolean;
  saveRecommendation: (rec: RecommendationResult) => Promise<void>;
  deleteRecommendation: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  isSaved: (id: string) => boolean;
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const activeUidRef = useRef<string | null>(null);
  const savingIdsRef = useRef<Set<string>>(new Set());

  // Load history when Firebase Auth state changes
  const loadUserHistory = useCallback(async () => {
    // If Firebase Auth is still resolving, hold loading state
    if (authLoading) {
      setLoading(true);
      return;
    }

    const currentUid = user?.uid || null;

    // Reset in-memory state on user change to prevent stale data exposure
    if (activeUidRef.current !== currentUid) {
      activeUidRef.current = currentUid;
      setHistory([]);
    }

    setLoading(true);

    if (currentUid) {
      // 1. Load user-scoped cache first for instant responsiveness
      const cached = StorageService.getUserHistory(currentUid);
      if (cached.length > 0) {
        setHistory(cached);
      }

      // 2. Fetch authoritative records from Cloud Firestore
      try {
        const firestoreRecords = await FirestoreService.getUserRecommendations(currentUid);
        setHistory(firestoreRecords);
        // Sync local cache with Firestore records
        localStorage.setItem(`fertilizer_ai_history_${currentUid}`, JSON.stringify(firestoreRecords));
      } catch (err) {
        console.warn('Failed to fetch recommendations from Firestore, using cached history:', err);
        // Retain cached history if available
        setHistory(StorageService.getUserHistory(currentUid));
      } finally {
        setLoading(false);
      }
    } else {
      // Guest mode (unauthenticated) - load guest localStorage only
      const guestHistory = StorageService.getUserHistory(null);
      setHistory(guestHistory);
      setLoading(false);
    }
  }, [user?.uid, authLoading]);

  useEffect(() => {
    loadUserHistory();
  }, [loadUserHistory]);

  const saveRecommendation = async (rec: RecommendationResult) => {
    if (!rec || !rec.id) return;

    // Guard against concurrent duplicate saves for the same recommendation ID
    if (savingIdsRef.current.has(rec.id)) {
      return;
    }
    savingIdsRef.current.add(rec.id);

    try {
      const currentUid = user?.uid || null;

      // 1. Optimistic UI update (deduplicated by ID)
      setHistory((prev) => {
        const filtered = prev.filter((item) => item.id !== rec.id);
        return [rec, ...filtered];
      });

      // 2. Persist to user-scoped localStorage
      StorageService.saveUserRecommendation(rec, currentUid);

      // 3. Persist to Cloud Firestore if user is authenticated
      if (currentUid) {
        try {
          await FirestoreService.saveRecommendation(currentUid, rec);
        } catch (err) {
          console.error('Failed to persist recommendation to Firestore for UID:', currentUid, err);
          // Keep local optimistic copy so user doesn't lose access
        }
      }
    } finally {
      savingIdsRef.current.delete(rec.id);
    }
  };

  const deleteRecommendation = async (id: string) => {
    if (!id) return;

    const currentUid = user?.uid || null;

    // 1. Optimistic UI update
    setHistory((prev) => prev.filter((item) => item.id !== id));

    // 2. Remove from user-scoped localStorage
    StorageService.deleteUserRecommendation(id, currentUid);

    // 3. Delete from Cloud Firestore if authenticated
    if (currentUid) {
      try {
        await FirestoreService.deleteRecommendation(currentUid, id);
      } catch (err) {
        console.error('Failed to delete recommendation from Firestore:', id, err);
      }
    }
  };

  const clearHistory = async () => {
    const currentUid = user?.uid || null;
    const itemsToDelete = [...history];

    // 1. Optimistic UI clear
    setHistory([]);

    // 2. Clear user-scoped localStorage
    StorageService.clearUserHistory(currentUid);

    // 3. Delete all records from Firestore if authenticated
    if (currentUid && itemsToDelete.length > 0) {
      try {
        await Promise.all(
          itemsToDelete.map((rec) => FirestoreService.deleteRecommendation(currentUid, rec.id))
        );
      } catch (err) {
        console.error('Failed to clear all user recommendations from Firestore:', err);
      }
    }
  };

  const isSaved = (id: string) => {
    return history.some((h) => h.id === id);
  };

  const refreshHistory = async () => {
    await loadUserHistory();
  };

  return (
    <HistoryContext.Provider
      value={{
        history,
        loading,
        saveRecommendation,
        deleteRecommendation,
        clearHistory,
        isSaved,
        refreshHistory,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within HistoryProvider');
  return context;
};
