import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import attendanceRoutes from './routes/attendance.js';
import busLocationRoutes from './routes/buslocation.js';
import NotificationRoutes from './routes/Notification.js';
import adminAuthRoutes from './routes/adminAuth.js';
import analyticsRoutes from './routes/analytics.js';
import Admin from './models/Admin.js';

dotenv.config();
const app = express();

// ✅ Updated CORS setup: allow both local + deployed frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://bus-tracking-app-wt0f.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// ✅ Session + Passport setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'dypatil-bustrack-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Admin.createStrategy());
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// ✅ Connect to MongoDB
const MONGO_URL = process.env.MONGO_URL;

mongoose.connect(MONGO_URL)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((error) => console.error('❌ MongoDB connection error:', error));

// ✅ Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'DY Patil Bus Tracking System - API Running',
    timestamp: new Date().toISOString()
  });
});

// ✅ Session check endpoint
app.get('/api/admin/session', (req, res) => {
  res.json({ 
    loggedIn: req.isAuthenticated(),
    signupDisabled: false
  });
});

// ✅ API Routes
app.use('/api/attendance', attendanceRoutes);
app.use('/', busLocationRoutes);
app.use('/api/alerts', NotificationRoutes);
app.use('/api/admin', adminAuthRoutes);

// ✅ Analytics route (protected)
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(403).json({ error: 'Access denied. Please login.' });
}
app.use('/api/analytics', ensureAdmin, analyticsRoutes);

// ✅ Serve frontend (React build)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../frontend/dist');
const indexPath = path.join(frontendPath, 'index.html');

app.use(express.static(frontendPath));

// API 404 handler
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Handle all other GET requests (React Router fallback)
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.originalUrl.startsWith('/api')) {
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath, err => {
        if (err) {
          console.error("sendFile error:", err.message);
          if (!res.headersSent) res.status(500).end();
        }
      });
    } else {
      res.status(503).send('Frontend build not found. Please run "npm run build".');
    }
  } else {
    next();
  }
});

app.use((err, req, res, next) => {
  console.error('Express global error:', err.message);
  if (!res.headersSent) res.status(500).send('Internal Server Error');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 DY Patil Bus Tracker - Server started on http://localhost:${PORT}`);
});
