import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { RecommendationResult, UserProfileData } from '../types';

/**
 * Cloud Firestore Service Layer
 * All user data is securely scoped and keyed by the authenticated Firebase User UID.
 */
export const FirestoreService = {
  /**
   * Saves or updates a user profile document in users/{uid}
   */
  async saveUserProfile(profile: Partial<UserProfileData> & { uid: string }): Promise<void> {
    const userRef = doc(db, 'users', profile.uid);
    const dataToSave: Record<string, unknown> = {
      uid: profile.uid,
      updatedAt: serverTimestamp(),
    };
    if (profile.displayName !== undefined) dataToSave.displayName = profile.displayName;
    if (profile.email !== undefined) dataToSave.email = profile.email;
    if (profile.photoURL !== undefined) dataToSave.photoURL = profile.photoURL;
    if (profile.farmLocation !== undefined) dataToSave.farmLocation = profile.farmLocation;
    if (profile.farmSize !== undefined) dataToSave.farmSize = profile.farmSize;
    if (profile.preferredLanguage !== undefined) dataToSave.preferredLanguage = profile.preferredLanguage;

    await setDoc(userRef, dataToSave, { merge: true });
  },

  /**
   * Retrieves a user profile document from users/{uid}
   */
  async getUserProfile(uid: string): Promise<UserProfileData | null> {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    return snap.exists() ? (snap.data() as UserProfileData) : null;
  },

  /**
   * Saves a completed recommendation to recommendations/{recommendationId}
   * and users/{uid}/history/{recommendationId} with strict user UID ownership.
   */
  async saveRecommendation(uid: string, rec: RecommendationResult): Promise<void> {
    if (!uid) {
      throw new Error('Cannot save recommendation to Firestore: User UID is required.');
    }

    const docId = rec.id || `rec_${Date.now()}`;
    const recData = {
      recommendationId: docId,
      id: docId,
      userId: uid,
      createdAt: serverTimestamp(),
      timestamp: rec.timestamp || new Date().toISOString(),

      // Core ML recommendations & confidence
      recommendedCrop: rec.crop?.name || rec.recommended_crop || 'Unknown Crop',
      cropConfidence: rec.crop_confidence ?? rec.suitabilityScore ?? 0,
      recommendedFertilizer: rec.primaryFertilizer?.name || rec.recommended_fertilizer || 'NPK',
      fertilizerConfidence: rec.fertilizer_confidence ?? rec.suitabilityScore ?? 0,
      cropProbabilities: rec.crop_probabilities || {},
      fertilizerProbabilities: rec.fertilizer_probabilities || {},

      // Live Weather & Gemini AI Advisory payloads
      weather: rec.weather || null,
      aiAdvice: rec.ai_advice || null,

      // Complete Agronomic context for UI hydration
      crop: rec.crop,
      soil: rec.soil,
      environment: rec.environment,
      primaryFertilizer: rec.primaryFertilizer,
      recommendedDosage: rec.recommendedDosage,
      applicationTiming: rec.applicationTiming,
      applicationMethod: rec.applicationMethod,
      suitabilityScore: rec.suitabilityScore,
      aiExplanation: rec.aiExplanation,
      nutrientAnalysis: rec.nutrientAnalysis,
      alternatives: rec.alternatives,
      recommended_crop: rec.recommended_crop,
      crop_confidence: rec.crop_confidence,
      crop_probabilities: rec.crop_probabilities,
      recommended_fertilizer: rec.recommended_fertilizer,
      fertilizer_confidence: rec.fertilizer_confidence,
      fertilizer_probabilities: rec.fertilizer_probabilities,
    };

    // 1. Save to top-level recommendations collection: recommendations/{recommendationId}
    const recRef = doc(db, 'recommendations', docId);
    await setDoc(recRef, recData);

    // 2. Also save to user's subcollection: users/{uid}/history/{recommendationId}
    const userHistRef = doc(db, 'users', uid, 'history', docId);
    await setDoc(userHistRef, recData);
  },

  /**
   * Retrieves all recommendations belonging to the authenticated user from Firestore.
   * Sorted newest recommendations first.
   */
  async getUserRecommendations(uid: string): Promise<RecommendationResult[]> {
    if (!uid) return [];

    try {
      // Query top-level recommendations collection filtered by authenticated user's UID
      const recCol = collection(db, 'recommendations');
      const q = query(recCol, where('userId', '==', uid));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const results = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            ...data,
            id: data.recommendationId || data.id || docSnap.id,
          } as RecommendationResult;
        });

        // Sort descending by timestamp in memory (ensuring latest first)
        return results.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      }

      // Fallback: Check user subcollection users/{uid}/history
      const historyCol = collection(db, 'users', uid, 'history');
      const userSnap = await getDocs(historyCol);
      const userResults = userSnap.docs.map((d) => {
        const data = d.data();
        return {
          ...data,
          id: data.recommendationId || data.id || d.id,
        } as RecommendationResult;
      });

      return userResults.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (err) {
      console.error('Error loading recommendations from Firestore for UID:', uid, err);
      throw err;
    }
  },

  /**
   * Retrieves all recommendations from users/{uid}/history
   */
  async getUserHistory(uid: string): Promise<RecommendationResult[]> {
    return this.getUserRecommendations(uid);
  },

  /**
   * Deletes a recommendation document from Firestore
   */
  async deleteRecommendation(uid: string, recId: string): Promise<void> {
    try {
      const recRef = doc(db, 'recommendations', recId);
      await deleteDoc(recRef);
    } catch {
      // Ignore if document not in top-level
    }

    try {
      const userHistRef = doc(db, 'users', uid, 'history', recId);
      await deleteDoc(userHistRef);
    } catch {
      // Ignore
    }
  },

  /**
   * Saves a favorite recommendation to users/{uid}/favorites/{recId}
   */
  async saveFavoriteRecommendation(uid: string, rec: RecommendationResult): Promise<void> {
    if (!uid) {
      throw new Error('Cannot save favorite recommendation: User UID is required.');
    }

    const docId = rec.id || `rec_${Date.now()}`;
    const favRecRef = doc(db, 'users', uid, 'favorites', docId);
    const recData = {
      recommendationId: docId,
      id: docId,
      userId: uid,
      createdAt: serverTimestamp(),
      timestamp: rec.timestamp || new Date().toISOString(),

      recommendedCrop: rec.crop?.name || rec.recommended_crop || 'Unknown Crop',
      cropConfidence: rec.crop_confidence ?? rec.suitabilityScore ?? 0,
      recommendedFertilizer: rec.primaryFertilizer?.name || rec.recommended_fertilizer || 'NPK',
      fertilizerConfidence: rec.fertilizer_confidence ?? rec.suitabilityScore ?? 0,
      cropProbabilities: rec.crop_probabilities || {},
      fertilizerProbabilities: rec.fertilizer_probabilities || {},

      weather: rec.weather || null,
      aiAdvice: rec.ai_advice || null,

      crop: rec.crop,
      soil: rec.soil,
      environment: rec.environment,
      primaryFertilizer: rec.primaryFertilizer,
      recommendedDosage: rec.recommendedDosage,
      applicationTiming: rec.applicationTiming,
      applicationMethod: rec.applicationMethod,
      suitabilityScore: rec.suitabilityScore,
      aiExplanation: rec.aiExplanation,
      nutrientAnalysis: rec.nutrientAnalysis,
      alternatives: rec.alternatives,
      recommended_crop: rec.recommended_crop,
      crop_confidence: rec.crop_confidence,
      crop_probabilities: rec.crop_probabilities,
      recommended_fertilizer: rec.recommended_fertilizer,
      fertilizer_confidence: rec.fertilizer_confidence,
      fertilizer_probabilities: rec.fertilizer_probabilities,
    };

    await setDoc(favRecRef, recData);
  },

  /**
   * Deletes a favorite recommendation from users/{uid}/favorites/{recId}
   */
  async deleteFavoriteRecommendation(uid: string, recId: string): Promise<void> {
    if (!uid || !recId) return;
    const favRecRef = doc(db, 'users', uid, 'favorites', recId);
    await deleteDoc(favRecRef);
  },

  /**
   * Retrieves all favorite recommendations for an authenticated user
   */
  async getUserFavoriteRecommendations(uid: string): Promise<RecommendationResult[]> {
    if (!uid) return [];
    try {
      const favCol = collection(db, 'users', uid, 'favorites');
      const snap = await getDocs(favCol);
      const results: RecommendationResult[] = [];
      snap.forEach((docSnap) => {
        // Exclude the 'user_favorites' metadata document
        if (docSnap.id !== 'user_favorites') {
          const data = docSnap.data();
          results.push({
            ...data,
            id: data.recommendationId || data.id || docSnap.id,
          } as RecommendationResult);
        }
      });
      return results.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (err) {
      console.error('Error fetching favorite recommendations for UID:', uid, err);
      return [];
    }
  },

  /**
   * Saves user favorites (crops, fertilizers, articles) to users/{uid}/favorites/user_favorites
   */
  async saveUserFavorites(
    uid: string,
    favorites: { crops: string[]; fertilizers: string[]; articles: string[] }
  ): Promise<void> {
    const favRef = doc(db, 'users', uid, 'favorites', 'user_favorites');
    await setDoc(
      favRef,
      {
        ...favorites,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  },

  /**
   * Retrieves user favorites (crops, fertilizers, articles) from users/{uid}/favorites/user_favorites
   */
  async getUserFavorites(
    uid: string
  ): Promise<{ crops: string[]; fertilizers: string[]; articles: string[] } | null> {
    const favRef = doc(db, 'users', uid, 'favorites', 'user_favorites');
    const snap = await getDoc(favRef);
    return snap.exists()
      ? (snap.data() as { crops: string[]; fertilizers: string[]; articles: string[] })
      : null;
  },
};
