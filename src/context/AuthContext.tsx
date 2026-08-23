import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { FirestoreService } from '../services/firestore';
import { AuthUser } from '../types';

export type { AuthUser };

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<AuthUser>;
  signup: (name: string, email: string, password: string) => Promise<AuthUser>;
  loginWithGoogle: () => Promise<AuthUser>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<boolean>;
  updateUserProfile: (data: { displayName?: string; photoURL?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Maps a Firebase User instance to our internal AuthUser representation
 */
function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName || user.email?.split('@')[0] || 'Farmer',
    email: user.email || '',
    photoURL: user.photoURL || undefined,
    createdAt: user.metadata.creationTime || new Date().toISOString(),
  };
}

/**
 * Maps Firebase Auth error codes to friendly error messages / translation keys
 */
function formatAuthError(error: unknown): Error {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: string }).code;
    switch (code) {
      case 'auth/user-not-found':
        return new Error('errUserNotFound');
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('errInvalidCredentials');
      case 'auth/email-already-in-use':
        return new Error('errEmailExists');
      case 'auth/weak-password':
        return new Error('errPasswordMin');
      case 'auth/invalid-email':
        return new Error('errEmailInvalid');
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return new Error('errPopupClosed');
      case 'auth/popup-blocked':
        return new Error('errPopupBlocked');
      case 'auth/account-exists-with-different-credential':
        return new Error('errAccountExistsWithDifferentCredential');
      case 'auth/network-request-failed':
        return new Error('errNetwork');
      default:
        return new Error((error as { message?: string }).message || 'errNetwork');
    }
  }
  return error instanceof Error ? error : new Error('errNetwork');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Listen to real-time Firebase Authentication state changes & session persistence
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mapped = mapFirebaseUser(firebaseUser);
        setUser(mapped);
        // Sync profile to Firestore asynchronously
        FirestoreService.saveUserProfile(mapped).catch(() => {});
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string,
    _rememberMe: boolean = true
  ): Promise<AuthUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const mappedUser = mapFirebaseUser(userCredential.user);
      setUser(mappedUser);
      return mappedUser;
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string
  ): Promise<AuthUser> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      // Update display name on Firebase User profile
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      const mappedUser: AuthUser = {
        ...mapFirebaseUser(userCredential.user),
        displayName: name.trim(),
      };

      setUser(mappedUser);

      // Save initial profile in Firestore
      await FirestoreService.saveUserProfile(mappedUser);

      return mappedUser;
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  const loginWithGoogle = async (): Promise<AuthUser> => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await signInWithPopup(auth, provider);
      const mappedUser = mapFirebaseUser(userCredential.user);
      setUser(mappedUser);
      await FirestoreService.saveUserProfile(mappedUser);
      return mappedUser;
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  const updateUserProfile = async (data: {
    displayName?: string;
    photoURL?: string;
  }): Promise<void> => {
    try {
      if (!auth.currentUser) throw new Error('No authenticated user session');
      await updateProfile(auth.currentUser, data);
      if (user) {
        const updated: AuthUser = {
          ...user,
          displayName: data.displayName !== undefined ? data.displayName : user.displayName,
          photoURL: data.photoURL !== undefined ? data.photoURL : user.photoURL,
        };
        setUser(updated);
        await FirestoreService.saveUserProfile({
          uid: updated.uid,
          displayName: updated.displayName,
          photoURL: updated.photoURL,
        });
      }
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return true;
    } catch (err) {
      throw formatAuthError(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
