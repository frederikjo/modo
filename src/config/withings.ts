export const WITHINGS_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_WITHINGS_CLIENT_ID!,
  clientSecret: process.env.WITHINGS_CLIENT_SECRET!,
  redirectUri: process.env.NEXT_PUBLIC_WITHINGS_REDIRECT_URI!,
  scopes: 'user.metrics',
  baseUrl: 'https://wbsapi.withings.net',
  authUrl: 'https://account.withings.com/oauth2_user/authorize2',
};