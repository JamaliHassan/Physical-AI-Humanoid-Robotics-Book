import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';
import { auth } from './auth/config.js';
import translationApi from './translation/index.js';

const app = new Hono();

// Add CORS middleware to allow requests from Docusaurus frontend
app.use('/*', cors({
  origin: ['http://localhost:3000'], // Default Docusaurus port
  credentials: true,
}));

// Mount better-auth routes - better-auth provides its own handler
app.use('/api/auth/*', async (c) => {
  // Get the request and call the auth handler
  const res = await auth.handler(c.req.raw);
  return c.newResponse(res.body, res.status, res.headers);
});

// Mount translation API routes
app.route('/api', translationApi);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const port = 4000;
console.log(`Server running on port ${port}`);

// Start the server using @hono/node-server
serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});