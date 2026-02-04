import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Task from '../models/Task.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await Task.deleteMany({});

    // Create demo users
    console.log('Creating demo users...');
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const demoUsers = [
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log(`Created ${createdUsers.length} demo users`);

    // Create demo tasks for the first user
    console.log('Creating demo tasks...');
    const demoTasks = [
      {
        title: 'Complete project proposal',
        description: 'Finish writing the project proposal document and send it to stakeholders',
        status: 'pending',
        user: createdUsers[0]._id,
      },
      {
        title: 'Review pull requests',
        description: 'Review and merge outstanding pull requests in the GitHub repository',
        status: 'in-progress',
        user: createdUsers[0]._id,
      },
      {
        title: 'Prepare presentation',
        description: 'Create slides for the quarterly review meeting',
        status: 'completed',
        user: createdUsers[0]._id,
      },
      {
        title: 'Team sync meeting',
        description: 'Attend weekly team sync meeting at 10 AM',
        status: 'pending',
        user: createdUsers[1]._id,
      },
      {
        title: 'Update documentation',
        description: 'Update API documentation with latest changes',
        status: 'in-progress',
        user: createdUsers[1]._id,
      }
    ];

    const createdTasks = await Task.insertMany(demoTasks);
    console.log(`Created ${createdTasks.length} demo tasks`);

    console.log('\n✅ Seed data created successfully!');
    console.log('\nDemo Credentials:');
    console.log('- Admin: admin@example.com / password123');
    console.log('- User 1: john@example.com / password123');
    console.log('- User 2: jane@example.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();