import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import AuthRoutes from './routes/authRoute.js';
import UserRoutes from './routes/userRoute.js';
import TaskRoutes from './routes/taskRoute.js';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: 'Too many requests from this IP, please try again later.' }
});
app.use(limiter);

// Middleware to parse JSON requests
app.use(cors());
app.use(express.json());    
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/user', UserRoutes);
app.use('/api/v1/task', TaskRoutes);


// Define a simple route
app.get('/', (req, res) => {
  res.send('API is running...');
});

export default app;

