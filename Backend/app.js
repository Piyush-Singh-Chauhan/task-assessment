import express from 'express';
import cors from 'cors';
import AuthRoutes from './routes/authRoute.js';
import UserRoutes from './routes/userRoute.js';
import TaskRoutes from './routes/taskRoute.js';

const app = express();


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

