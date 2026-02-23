import app from './app';
import pool from './config/database';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Optional: test DB on startup
pool.query('SELECT NOW()').then((res) => {
  console.log('DB connected:', res.rows[0]?.now);
}).catch((err) => {
  console.warn('DB connection check failed:', err.message);
});
