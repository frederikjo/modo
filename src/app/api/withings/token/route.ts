import { NextRequest, NextResponse } from 'next/server';
import { WITHINGS_CONFIG } from '@/config/withings';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const tokenResponse = await fetch(`${WITHINGS_CONFIG.baseUrl}/v2/oauth2`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: body.grant_type,
        client_id: body.client_id,
        client_secret: WITHINGS_CONFIG.clientSecret,
        ...(body.code && { code: body.code }),
        ...(body.refresh_token && { refresh_token: body.refresh_token }),
        ...(body.redirect_uri && { redirect_uri: body.redirect_uri }),
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: tokenData.error || 'Token exchange failed' },
        { status: 400 }
      );
    }

    return NextResponse.json(tokenData);
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}