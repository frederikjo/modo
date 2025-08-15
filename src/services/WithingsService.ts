import { ProcessedWeightData, WithingsTokens, WithingsWeightData } from '@/types/withings';
import { WITHINGS_CONFIG } from '@/config/withings';

export class WithingsService {
  private tokens: WithingsTokens | null = null;

  constructor(tokens?: WithingsTokens) {
    this.tokens = tokens;
  }

  // Generate OAuth authorization URL
  generateAuthUrl(): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: WITHINGS_CONFIG.clientId,
      redirect_uri: WITHINGS_CONFIG.redirectUri,
      scope: WITHINGS_CONFIG.scopes,
      state: this.generateState(),
    });

    return `${WITHINGS_CONFIG.authUrl}?${params.toString()}`;
  }

  // Exchange authorization code for tokens
  async exchangeCodeForTokens(code: string): Promise<WithingsTokens> {
    const response = await fetch('/api/withings/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: WITHINGS_CONFIG.clientId,
        code,
        redirect_uri: WITHINGS_CONFIG.redirectUri,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await response.json();
    tokens.expires_at = Date.now() + (tokens.expires_in * 1000);
    this.tokens = tokens;
    return tokens;
  }

  // Refresh access token
  async refreshTokens(): Promise<WithingsTokens> {
    if (!this.tokens?.refresh_token) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/api/withings/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        client_id: WITHINGS_CONFIG.clientId,
        refresh_token: this.tokens.refresh_token,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh tokens');
    }

    const newTokens = await response.json();
    newTokens.expires_at = Date.now() + (newTokens.expires_in * 1000);
    this.tokens = newTokens;
    return newTokens;
  }

  // Check if tokens need refreshing and refresh if needed
  async ensureValidTokens(): Promise<void> {
    if (!this.tokens) {
      throw new Error('No tokens available');
    }

    // Refresh if tokens expire in the next 5 minutes
    if (this.tokens.expires_at - Date.now() < 300000) {
      await this.refreshTokens();
    }
  }

  // Get weight measurements
  async getWeightMeasurements(
    startDate?: Date,
    endDate?: Date
  ): Promise<ProcessedWeightData[]> {
    await this.ensureValidTokens();

    const params = new URLSearchParams({
      action: 'getmeas',
      meastype: '1', // Weight measurements
    });

    if (startDate) {
      params.append('startdate', Math.floor(startDate.getTime() / 1000).toString());
    }

    if (endDate) {
      params.append('enddate', Math.floor(endDate.getTime() / 1000).toString());
    }

    const response = await fetch('/api/withings/measurements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.tokens!.access_token}`,
      },
      body: JSON.stringify({ params: params.toString() }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch weight measurements');
    }

    const data: WithingsWeightData = await response.json();
    return this.processWeightData(data);
  }

  // Process raw Withings data into our format
  private processWeightData(data: WithingsWeightData): ProcessedWeightData[] {
    if (data.status !== 0 || !data.body?.measuregrps) {
      return [];
    }

    return data.body.measuregrps
      .map(group => {
        const weightMeasure = group.measures.find(m => m.type === 1);
        const fatRatioMeasure = group.measures.find(m => m.type === 6);
        const fatFreeMassMeasure = group.measures.find(m => m.type === 5);

        if (!weightMeasure) return null;

        const weight = weightMeasure.value * Math.pow(10, weightMeasure.unit);
        const fatRatio = fatRatioMeasure 
          ? fatRatioMeasure.value * Math.pow(10, fatRatioMeasure.unit)
          : undefined;
        const fatFreeMass = fatFreeMassMeasure
          ? fatFreeMassMeasure.value * Math.pow(10, fatFreeMassMeasure.unit)
          : undefined;

        return {
          date: new Date(group.date * 1000),
          weight,
          fatRatio,
          fatFreeMass,
          unit: 'kg' as const,
        };
      })
      .filter((item): item is ProcessedWeightData => item !== null)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  // Generate a random state for OAuth security
  private generateState(): string {
    return Math.random().toString(36).substring(2, 15) +
           Math.random().toString(36).substring(2, 15);
  }

  // Check if user is connected
  isConnected(): boolean {
    return !!this.tokens && this.tokens.expires_at > Date.now();
  }

  // Get current tokens
  getTokens(): WithingsTokens | null {
    return this.tokens;
  }

  // Set tokens (for loading from storage)
  setTokens(tokens: WithingsTokens): void {
    this.tokens = tokens;
  }
}