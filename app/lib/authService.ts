import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { AuthChangeEvent, Session } from '@supabase/supabase-js';
import { UserAccount, PlanType, SubscriptionStatus } from './types';

export interface AuthUser {
    id: string;
    email: string;
    needsConfirmation?: boolean;
}

export interface SignUpData {
    email: string;
    password: string;
    name: string;
    creci?: string;
    referredBy?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export const signUp = async (data: SignUpData): Promise<{ user: AuthUser | null; error: Error | null }> => {
    try {
        console.log('🔵 [SignUp] Iniciando cadastro...', { email: data.email, name: data.name });
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.name,
                    creci: data.creci || '',
                    referred_by: data.referredBy || null,
                }
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Failed to create user');

        const needsConfirmation = !authData.session;
        return {
            user: {
                id: authData.user.id,
                email: authData.user.email!,
                needsConfirmation
            },
            error: null,
        };
    } catch (error) {
        console.error('❌ [SignUp] Erro geral:', error);
        return { user: null, error: error as Error };
    }
};

export const signIn = async (data: SignInData): Promise<{ user: AuthUser | null; error: Error | null }> => {
    try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });
        if (error) throw error;
        if (!authData.user) throw new Error('Failed to sign in');
        return {
            user: { id: authData.user.id, email: authData.user.email! },
            error: null,
        };
    } catch (error) {
        return { user: null, error: error as Error };
    }
};

export const signOut = async (): Promise<{ error: Error | null }> => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
};

export const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/login?reset=true`,
        });
        if (error) throw error;
        return { error: null };
    } catch (error) {
        return { error: error as Error };
    }
};

export const getCurrentUser = async (): Promise<{ user: AuthUser | null; error: Error | null }> => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        if (!user) return { user: null, error: null };
        return {
            user: { id: user.id, email: user.email! },
            error: null,
        };
    } catch (error) {
        return { user: null, error: error as Error };
    }
};

export const getUserProfile = async (userId: string): Promise<{ profile: UserAccount | null; error: Error | null }> => {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        if (!data) throw new Error('User profile not found');

        const profile: UserAccount = {
            id: data.id,
            email: data.email,
            name: data.name,
            creci: data.creci,
            plan: data.plan as PlanType,
            status: data.status as SubscriptionStatus,
            trialDaysLeft: data.trial_days_left,
            earningsBalance: parseFloat(data.earnings_balance),
            isAdmin: data.is_admin,
        };
        return { profile, error: null };
    } catch (error) {
        return { profile: null, error: error as Error };
    }
};

export const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [profile, setProfile] = useState<UserAccount | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser({ id: session.user.id, email: session.user.email! });
                    const { profile: userProfile } = await getUserProfile(session.user.id);
                    if (userProfile) setProfile(userProfile);
                }
            } catch (err) {
                console.error('Error initAuth:', err);
            } finally {
                setIsLoading(false);
            }
        };
        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                setUser({ id: session.user.id, email: session.user.email! });
                const { profile: userProfile } = await getUserProfile(session.user.id);
                if (userProfile) setProfile(userProfile);
            } else {
                setUser(null);
                setProfile(null);
            }
            setIsLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return { user, profile, isLoading };
};
