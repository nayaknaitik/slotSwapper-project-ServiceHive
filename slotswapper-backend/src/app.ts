import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import swapRoutes from './routes/swapRoutes';

const app = express();
app.use(cors({
  origin: ['http://localhost:3000',
  'https://slot-swapper-project-service-hive.vercel.app/'],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/', swapRoutes);

export default app;
