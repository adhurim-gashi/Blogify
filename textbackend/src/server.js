require('dotenv').config();
// Validate and normalize environment variables before anything else
const config = require('./config/env');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const categoryRoutes = require('./routes/categories');
const mediaRoutes = require('./routes/media');
const dashboardRoutes = require('./routes/dashboard');
const tagsRoutes = require('./routes/tags');
const settingsRoutes = require('./routes/settings');
const commentsRoutes = require('./routes/comments');
const pagesRoutes = require('./routes/pages');
const newsletterRoutes = require('./routes/newsletter');

const { responseWrapper } = require('./middlewares/responseWrapper');
const app = express();

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.set('trust proxy', true);
app.use(helmet({ contentSecurityPolicy: false }));
const allowed = config.corsOrigins;
// Use CORS origin whitelist from validated config
app.use(cors({ origin: function (origin, cb) { if (!origin) return cb(null, true); if (allowed.indexOf(origin) !== -1) return cb(null, true); return cb(new Error('Not allowed by CORS')); } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Response wrapper for consistent responses
app.use(responseWrapper);

// Global rate limiter for public endpoints
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/pages', pagesRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/tags', tagsRoutes);
app.use('/api/settings', settingsRoutes);

app.use(errorHandler);

const PORT = config.port || 4000;
app.listen(PORT, () => {
  console.log(`Blogify backend listening on port ${PORT}`);
});
