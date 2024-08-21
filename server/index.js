import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import todoRoutes from './routes/todoRoutes.js';

dotenv.config();

const app = express();

// Trust the first proxy (necessary for rate-limiter to access request IP)
app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xssClean());

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Routes
app.use('/api/todos', todoRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
