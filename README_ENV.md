# Environment configuration

This project uses a single `.env` file to configure environments and API base URLs.

Variables:
- `PUBLIC_APP_ENV`: `development` or `production`. Defaults to `development`.
- `PUBLIC_API_BASE_URL`: Optional direct override. If set, it takes precedence.
- `PUBLIC_API_BASE_URL_DEV`: Base URL for development.
- `PUBLIC_API_BASE_URL_PROD`: Base URL for production.
- `VITE_API_BASE_URL`: Optional legacy variable supported for backward compatibility.

Resolution order for API base URL:
1. `PUBLIC_API_BASE_URL` (or `VITE_API_BASE_URL`)
2. If `PUBLIC_APP_ENV` includes `prod`, use `PUBLIC_API_BASE_URL_PROD` (fallback to DEV if missing).
3. Otherwise use `PUBLIC_API_BASE_URL_DEV` (fallback to PROD if missing).
4. Default: `http://localhost:8080`.

Examples:

```
PUBLIC_APP_ENV=development
PUBLIC_API_BASE_URL_DEV=http://localhost:8080
PUBLIC_API_BASE_URL_PROD=https://api.example.com
```

To switch to production, set:
```
PUBLIC_APP_ENV=production
```

Deployment notes:
- In your hosting provider, set the variables you need (prefer `PUBLIC_API_BASE_URL`).
- The `PUBLIC_` prefix makes variables available in the client (Astro/Vite convention).
