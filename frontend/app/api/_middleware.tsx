import { createProxyMiddleware } from 'http-proxy-middleware';

// This will apply to all requests starting with /api/
export function middleware(req, res) {
  if (req.url.startsWith('/api/')) {
    return createProxyMiddleware({
      target: 'http://127.0.0.1:8000', // Django backend
      changeOrigin: true,              // Ensures that the origin header is properly set
      cookieDomainRewrite: {
        '*': '',  // Ensures that the domain for cookies is rewritten if necessary
      },
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Origin', 'http://127.0.0.1:8000'); // Ensure Origin is set correctly
      },
    })(req, res); // This forwards the request to the Django backend
  }

  // You can handle other requests here as needed
}
