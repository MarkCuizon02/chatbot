import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for common Supabase operations
export const supabaseHelpers = {
  // Authentication
  async signUp(email: string, password: string) {
    return await supabase.auth.signUp({
      email,
      password,
    });
  },

  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    });
  },

  async signOut() {
    return await supabase.auth.signOut();
  },

  async getCurrentUser() {
    return await supabase.auth.getUser();
  },

  // Real-time subscriptions
  subscribeToTable(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  },

  // Database operations (alternative to Prisma for simple queries)
  async getPricingPlans() {
    const { data, error } = await supabase
      .from('PricingPlan')
      .select(`
        *,
        features:PlanFeature(*)
      `)
      .eq('isActive', true)
      .order('price', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getAgents() {
    const { data, error } = await supabase
      .from('Agent')
      .select('*')
      .order('displayOrder', { ascending: true });

    if (error) throw error;
    return data;
  }
}; 