import { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient } from '../services/supabase';
import { getAuthBootstrapState, getCurrentProfile, getCurrentDogs } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [dogs, setDogs] = useState([]);
  const [bootstrapping, setBootstrapping] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const state = await getAuthBootstrapState();
        if (!mounted) return;
        setSession(state.session);
        setProfile(state.profile);
        setDogs(state.dogs);
      } catch {
        // no session
      } finally {
        if (mounted) setBootstrapping(false);
      }
    }

    bootstrap();

    let subscription;
    try {
      const client = getSupabaseClient();
      const { data } = client.auth.onAuthStateChange(async (event, newSession) => {
        if (!mounted) return;
        setSession(newSession);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          const [p, d] = await Promise.all([getCurrentProfile(), getCurrentDogs()]);
          if (mounted) { setProfile(p); setDogs(d); }
        }
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setDogs([]);
        }
      });
      subscription = data.subscription;
    } catch {
      // supabase not configured
    }

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  async function refreshProfile() {
    const [p, d] = await Promise.all([getCurrentProfile(), getCurrentDogs()]);
    setProfile(p);
    setDogs(d);
  }

  return (
    <AuthContext.Provider value={{ session, profile, dogs, bootstrapping, refreshProfile, setProfile, setDogs }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
