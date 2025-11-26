/**
 * Custom fetch function that proxies requests through Next.js API routes
 * to avoid CORS issues when connecting to backend services.
 */
export function createProxyFetch(): typeof fetch {
  return async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    // Check if this is a request to the backend that needs proxying
    const backendUrl = process.env.NEXT_PUBLIC_A2A_URL || 'http://localhost:8085';
    
    if (url.startsWith(backendUrl)) {
      // Replace backend URL with proxy route
      const path = url.replace(backendUrl, '');
      const proxyUrl = `/api/proxy${path}`;
      
      // Use the proxy URL instead
      return fetch(proxyUrl, init);
    }
    
    // For non-backend URLs, use normal fetch
    return fetch(url, init);
  };
}
