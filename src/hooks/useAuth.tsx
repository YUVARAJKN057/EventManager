import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { auth, db } from '../lib/firebase';
import { doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { onAuthStateChanged, User, signOut as fbSignOut } from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'student' | 'club_owner' | 'admin';
  interests: string[];
  bookmarks: string[];
  rsvps: string[];
  reminders?: string[];
  onboarded: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginAsDemo: (email: string, role: 'student' | 'club_owner' | 'admin', name: string) => void;
  logout: () => Promise<void>;
  toggleReminder: (eventId: string) => Promise<boolean>;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const DEMO_STORAGE_KEY = 'eventmanager_demo_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to load demo session from localStorage
  const loadDemoSession = useCallback((): { user: User; profile: UserProfile } | null => {
    try {
      const stored = localStorage.getItem(DEMO_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.uid && parsed?.email) {
          const demoUser = {
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName || 'Demo User',
            photoURL: parsed.photoURL || '',
            emailVerified: true,
            isAnonymous: false,
          } as unknown as User;

          const demoProfile: UserProfile = {
            uid: parsed.uid,
            email: parsed.email,
            displayName: parsed.displayName || 'Demo User',
            photoURL: parsed.photoURL || '',
            role: parsed.role || (parsed.email === 'yuvarajkn6360@gmail.com' ? 'admin' : 'student'),
            interests: parsed.interests || ['Tech', 'Sports', 'Music'],
            bookmarks: parsed.bookmarks || [],
            rsvps: parsed.rsvps || [],
            reminders: parsed.reminders || [],
            onboarded: parsed.onboarded ?? true
          };

          return { user: demoUser, profile: demoProfile };
        }
      }
    } catch (e) {
      console.warn('Failed to parse demo session:', e);
    }
    return null;
  }, []);

  useEffect(() => {
    let isMounted = true;
    let unsubscribeProfile: (() => void) | null = null;

    // Safety timeout: never let loading hang indefinitely under any network condition
    const safetyTimeout = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 2000);

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      if (!isMounted) return;

      if (u) {
        setUser(u);
        const isAdminEmail = u.email === 'yuvarajkn6360@gmail.com';
        const defaultRole: 'student' | 'club_owner' | 'admin' = isAdminEmail ? 'admin' : 'student';

        const fallbackProfile: UserProfile = {
          uid: u.uid,
          email: u.email || '',
          displayName: u.displayName || u.email?.split('@')[0] || 'User',
          photoURL: u.photoURL || '',
          role: defaultRole,
          interests: ['Tech', 'Music'],
          bookmarks: [],
          rsvps: [],
          reminders: [],
          onboarded: true
        };

        try {
          const profileRef = doc(db, 'users', u.uid);

          if (unsubscribeProfile) {
            unsubscribeProfile();
            unsubscribeProfile = null;
          }

          unsubscribeProfile = onSnapshot(
            profileRef,
            (snap) => {
              if (!isMounted) return;
              if (snap.exists()) {
                const data = snap.data() as UserProfile;
                setProfile({
                  ...data,
                  role: isAdminEmail ? 'admin' : (data.role || defaultRole),
                  reminders: data.reminders || []
                });
              } else {
                // Auto-create document if missing
                const initialProfile: UserProfile = {
                  uid: u.uid,
                  email: u.email || '',
                  displayName: u.displayName || u.email?.split('@')[0] || 'Campus Student',
                  photoURL: u.photoURL || '',
                  role: defaultRole,
                  interests: ['Tech', 'Sports'],
                  bookmarks: [],
                  rsvps: [],
                  reminders: [],
                  onboarded: true
                };

                setDoc(profileRef, initialProfile).catch((err) => {
                  console.warn('Profile write restricted or offline, using fallback:', err);
                });

                setProfile(initialProfile);
              }
              setLoading(false);
            },
            (error) => {
              console.warn('Profile snapshot error, applying resilient fallback:', error);
              if (isMounted) {
                setProfile(fallbackProfile);
                setLoading(false);
              }
            }
          );
        } catch (err) {
          console.warn('Firestore initialization error:', err);
          if (isMounted) {
            setProfile(fallbackProfile);
            setLoading(false);
          }
        }
      } else {
        // Check if demo user is stored locally
        const demo = loadDemoSession();
        if (demo && isMounted) {
          setUser(demo.user);
          setProfile(demo.profile);
          setLoading(false);
        } else if (isMounted) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(safetyTimeout);
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [loadDemoSession]);

  // Method to login as demo user instantly
  const loginAsDemo = useCallback((email: string, role: 'student' | 'club_owner' | 'admin', name: string) => {
    const uid = 'demo_' + Math.random().toString(36).substring(2, 9);
    const demoData: UserProfile = {
      uid,
      email,
      displayName: name,
      photoURL: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role,
      interests: ['Tech', 'Music', 'Sports'],
      bookmarks: [],
      rsvps: [],
      reminders: [],
      onboarded: true
    };

    localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoData));

    const demoUser = {
      uid,
      email,
      displayName: name,
      photoURL: demoData.photoURL,
      emailVerified: true,
      isAnonymous: false
    } as unknown as User;

    setUser(demoUser);
    setProfile(demoData);
    setLoading(false);
  }, []);

  // Method to sign out completely
  const logout = useCallback(async () => {
    localStorage.removeItem(DEMO_STORAGE_KEY);
    try {
      await fbSignOut(auth);
    } catch (e) {
      console.warn('Firebase signout error:', e);
    }
    setUser(null);
    setProfile(null);
  }, []);

  // Toggle 'Remind Me' notifications on an event
  const toggleReminder = useCallback(async (eventId: string): Promise<boolean> => {
    if (!user && !profile) return false;

    const currentReminders = profile?.reminders || [];
    const isReminded = currentReminders.includes(eventId);
    const updatedReminders = isReminded
      ? currentReminders.filter(id => id !== eventId)
      : [...currentReminders, eventId];

    // Optimistically update local profile state
    setProfile(prev => prev ? { ...prev, reminders: updatedReminders } : null);

    // If demo session, update in localStorage
    const stored = localStorage.getItem(DEMO_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({
          ...parsed,
          reminders: updatedReminders
        }));
      } catch (e) {
        console.warn('Local demo storage update note:', e);
      }
    }

    // Persist to Firestore if real user session
    if (user?.uid && !user.uid.startsWith('demo_')) {
      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          reminders: isReminded ? arrayRemove(eventId) : arrayUnion(eventId)
        });
      } catch (err) {
        console.warn('Firestore reminder update note:', err);
      }
    }

    return !isReminded;
  }, [user, profile]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        loginAsDemo,
        logout,
        toggleReminder,
        setProfile,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
