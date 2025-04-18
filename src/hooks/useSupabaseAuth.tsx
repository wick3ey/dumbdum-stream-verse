
import { useState, useEffect } from 'react';
import { supabase, User, Session } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (username: string, password: string) => {
    try {
      // For our mock implementation, we'll create a user with the username as the email
      // In a real implementation with Supabase, you would need to provide an email
      const mockEmail = `${username}@example.com`;
      
      const { error } = await supabase.auth.signUp({
        email: mockEmail,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Signup successful",
        description: "Account created successfully",
      });
      return true;
    } catch (error) {
      console.error('Error signing up:', error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signIn = async (username: string, password: string) => {
    try {
      // For our mock implementation, we'll sign in with the username as the email
      // In a real implementation with Supabase, you would use an actual email
      const mockEmail = `${username}@example.com`;
      
      const { error } = await supabase.auth.signInWithPassword({
        email: mockEmail,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      return true;
    } catch (error) {
      console.error('Error signing in:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logout successful",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  };
}
