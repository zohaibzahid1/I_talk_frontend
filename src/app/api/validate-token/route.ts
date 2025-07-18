import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();
    
    if (!accessToken) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    // Make a request to the GraphQL backend to validate the token
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    const response = await fetch(`${backendUrl}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `access_token=${accessToken}`, // Pass the token in cookies
      },
      body: JSON.stringify({
        query: `
          query ValidateToken {
            validateToken
          }
        `,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GraphQL validation errors:', data.errors);
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const isValid = data.data?.validateToken || false;
    
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error('Token validation error:', error);
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
