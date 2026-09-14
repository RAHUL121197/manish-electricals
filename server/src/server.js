require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { createApp } = require('./app');

if (!process.env.DATABASE_URL) {
  // eslint-disable-next-line no-console
  console.warn('[server] DATABASE_URL is not set. API endpoints that need the database will return errors.');
}

if (!process.env.JWT_SECRET) {
  // eslint-disable-next-line no-console
  console.warn('[server] JWT_SECRET is not set. Using an insecure development fallback — configure it in production.');
  process.env.JWT_SECRET = 'dev_only_insecure_secret_change_me';
}

const port = Number(process.env.PORT || 5000);
const app = createApp();

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] MANISH ELECTRICALS API listening on http://localhost:${port}`);
});

function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`[server] ${signal} received, shutting down gracefully.`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));