"use client";

import { useState, useEffect, useCallback } from "react";
import { WithingsService } from "@/services/WithingsService";
import { WithingsTokens, ProcessedWeightData } from "@/types/withings";
import { supabase } from "@/lib/supabase";

const STORAGE_KEY = "modo-withings-tokens";

export const useWithings = () => {
  const [service, setService] = useState<WithingsService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weightData, setWeightData] = useState<ProcessedWeightData[]>([]);

  // Initialize service and load tokens
  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to load tokens from Supabase first, then localStorage
      let tokens: WithingsTokens | null = null;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: integration } = await supabase
            .from('integrations')
            .select('tokens')
            .eq('user_id', session.user.id)
            .eq('service', 'withings')
            .single();
          
          if (integration?.tokens) {
            tokens = integration.tokens;
          }
        }
      } catch (supabaseError) {
        console.log('Supabase not available, using localStorage');
      }

      // Fall back to localStorage
      if (!tokens && typeof window !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          tokens = JSON.parse(stored);
        }
      }

      const withingsService = new WithingsService(tokens || undefined);
      setService(withingsService);
      setIsConnected(withingsService.isConnected());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Initialization failed');
    } finally {
      setLoading(false);
    }
  }, []);

  // Save tokens to both Supabase and localStorage
  const saveTokens = useCallback(async (tokens: WithingsTokens) => {
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }

    // Save to Supabase if available
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase
          .from('integrations')
          .upsert({
            user_id: session.user.id,
            service: 'withings',
            tokens: tokens,
            connected_at: new Date().toISOString(),
          });
      }
    } catch (supabaseError) {
      console.log('Could not save to Supabase, saved to localStorage only');
    }
  }, []);

  // Connect to Withings
  const connect = useCallback((): string => {
    if (!service) throw new Error('Service not initialized');
    return service.generateAuthUrl();
  }, [service]);

  // Complete OAuth flow
  const handleAuthCallback = useCallback(async (code: string) => {
    if (!service) throw new Error('Service not initialized');
    
    try {
      setLoading(true);
      setError(null);
      
      const tokens = await service.exchangeCodeForTokens(code);
      await saveTokens(tokens);
      
      setIsConnected(true);
      return tokens;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, saveTokens]);

  // Disconnect from Withings
  const disconnect = useCallback(async () => {
    try {
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY);
      }

      // Remove from Supabase
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase
            .from('integrations')
            .delete()
            .eq('user_id', session.user.id)
            .eq('service', 'withings');
        }
      } catch (supabaseError) {
        console.log('Could not remove from Supabase');
      }

      // Reset service
      const newService = new WithingsService();
      setService(newService);
      setIsConnected(false);
      setWeightData([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    }
  }, []);

  // Fetch weight data
  const fetchWeightData = useCallback(async (
    startDate?: Date,
    endDate?: Date
  ): Promise<ProcessedWeightData[]> => {
    if (!service || !isConnected) {
      throw new Error('Not connected to Withings');
    }

    try {
      setLoading(true);
      setError(null);
      
      const data = await service.getWeightMeasurements(startDate, endDate);
      setWeightData(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch weight data';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [service, isConnected]);

  // Get latest weight
  const getLatestWeight = useCallback((): ProcessedWeightData | null => {
    return weightData.length > 0 ? weightData[0] : null;
  }, [weightData]);

  // Get weight trend (last 7 days vs previous 7 days)
  const getWeightTrend = useCallback((): {
    current: number;
    previous: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  } | null => {
    if (weightData.length < 2) return null;

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const recentWeights = weightData.filter(d => d.date >= sevenDaysAgo);
    const previousWeights = weightData.filter(d => 
      d.date >= fourteenDaysAgo && d.date < sevenDaysAgo
    );

    if (recentWeights.length === 0 || previousWeights.length === 0) {
      return null;
    }

    const currentAvg = recentWeights.reduce((sum, w) => sum + w.weight, 0) / recentWeights.length;
    const previousAvg = previousWeights.reduce((sum, w) => sum + w.weight, 0) / previousWeights.length;
    const change = currentAvg - previousAvg;

    return {
      current: currentAvg,
      previous: previousAvg,
      change,
      trend: Math.abs(change) < 0.1 ? 'stable' : change > 0 ? 'up' : 'down',
    };
  }, [weightData]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Auto-fetch weight data when connected
  useEffect(() => {
    if (isConnected && service) {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      fetchWeightData(thirtyDaysAgo).catch(console.error);
    }
  }, [isConnected, service, fetchWeightData]);

  return {
    // State
    isConnected,
    loading,
    error,
    weightData,

    // Actions
    connect,
    disconnect,
    handleAuthCallback,
    fetchWeightData,
    clearError,

    // Computed values
    latestWeight: getLatestWeight(),
    weightTrend: getWeightTrend(),
  };
};