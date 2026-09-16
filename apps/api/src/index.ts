import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import resumeRoutes from './routes/resumes';
import jobRoutes from './routes/jobs';
import matchRoutes from './routes/matches';
import feedbackRoutes from './routes/feedback';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded static files if needed
app.use('/uploads', express.static(process.env.STORAGE_PATH || './uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'ResumeIQ API Service' });
});

app.listen(PORT, () => {
  console.log(`ResumeIQ API Server running on port ${PORT}`);
});
