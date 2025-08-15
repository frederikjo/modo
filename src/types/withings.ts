export interface WithingsTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
  user_id: string;
  expires_at: number;
}

export interface WithingsWeightMeasurement {
  value: number;
  type: number; // 1 = weight, 5 = fat free mass, 6 = fat ratio, etc.
  unit: number; // power of 10 to apply to value
  date: number; // timestamp
}

export interface WithingsWeightData {
  status: number;
  body: {
    updatetime: number;
    timezone: string;
    measuregrps: Array<{
      grpid: number;
      attrib: number;
      date: number;
      created: number;
      category: number;
      measures: WithingsWeightMeasurement[];
    }>;
  };
}

export interface ProcessedWeightData {
  date: Date;
  weight: number;
  fatRatio?: number;
  fatFreeMass?: number;
  unit: 'kg' | 'lbs';
}