# CORS Fix Documentation

## Problem
The frontend (Next.js on `localhost:3000`) was trying to fetch directly from the backend (`localhost:8085`) in the browser, which triggered CORS policy errors because the backend doesn't have the `Access-Control-Allow-Origin` header set.

## Solution
Instead of making direct requests from the browser to the backend, we now route all backend requests through a Next.js API proxy route. This avoids CORS entirely because:

1. The browser makes requests to the same origin (`localhost:3000/api/proxy/...`)
2. The Next.js server handles the request server-side and forwards it to the backend
3. The backend responds to the Next.js server (no CORS needed for server-to-server)
4. Next.js returns the response to the browser

## Implementation Details

### 1. API Proxy Route
**File:** `src/app/api/proxy/[...path]/route.ts`

This catch-all route handles all requests to `/api/proxy/*` and forwards them to the backend server defined in `NEXT_PUBLIC_A2A_URL`.

### 2. Proxy Fetch Helper
**File:** `src/lib/proxy-fetch.ts`

The `createProxyFetch()` function returns a custom fetch implementation that automatically redirects backend requests through the proxy:
- Detects if a request is going to the backend URL
- Replaces the backend URL with `/api/proxy/...`
- Falls back to normal fetch for other URLs

### 3. Updated Client Usage
**Files:**
- `src/hooks/useChat.ts`
- `src/app/pages/AgentListPage.tsx`

Instead of using `window.fetch.bind(window)`, these files now use `createProxyFetch()` when instantiating the `A2AClient`.

**Before:**
```typescript
const client = new A2AClient(agentUrl!, window.fetch.bind(window));
```

**After:**
```typescript
import { createProxyFetch } from "@/lib/proxy-fetch";

const client = new A2AClient(agentUrl!, createProxyFetch());
```

### 4. Environment Configuration
**File:** `.env.example`

```env
NEXT_PUBLIC_A2A_URL=http://localhost:8085
```

This variable defines the backend server URL. The proxy route uses this to know where to forward requests.

## Request Flow

```
Browser → http://localhost:3000/api/proxy/.well-known/agent.json
         ↓
Next.js API Route (server-side)
         ↓
Backend → http://localhost:8085/.well-known/agent.json
         ↓
Response flows back through the same path
```

## Testing
To test the fix:
1. Start your backend server on `localhost:8085`
2. Start the Next.js dev server: `npm run dev` or `bun dev`
3. Try fetching agent data - no CORS errors should appear
4. Check browser DevTools Network tab - requests should go to `/api/proxy/*`

## Alternative Solutions (Not Used)
- **Add CORS headers to backend:** Would require backend modifications
- **Use a reverse proxy (nginx, etc.):** More complex setup for development
- **Disable browser security (unsafe):** Not recommended for production
