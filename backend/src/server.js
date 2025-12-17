import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { auth } from './auth/config.js';

const app = new Hono();

// Add CORS middleware to allow requests from Docusaurus frontend
app.use('/*', cors({
  origin: ['http://localhost:3000'], // Default Docusaurus port
  credentials: true,
}));

// Mount better-auth routes
app.route('/api/auth', auth);

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'OK', timestamp: new Date().toISOString() });
});

const port = 4000;
console.log(`Server running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};