import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_A2A_URL || 'http://localhost:8085';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;
    
    // Forward query parameters
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const targetUrl = queryString ? `${url}?${queryString}` : url;

    console.log('[Proxy GET]', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    // Check if response is streaming (SSE/text/event-stream)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // Stream the response directly without parsing
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For regular JSON responses
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Proxy GET Error]', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathString = path.join('/');
    const url = `${BACKEND_URL}/${pathString}`;
    
    const body = await request.text();

    console.log('[Proxy POST]', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body,
    });

    // Check if response is streaming (SSE/text/event-stream)
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // Stream the response directly without parsing
      return new NextResponse(response.body, {
        status: response.status,
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // For regular JSON responses
    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Proxy POST Error]', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: String(error) },
      { status: 500 }
    );
  }
}
