import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Society from '../models/Society.mjs';

dotenv.config();

const seedSocieties = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/societrix');
    console.log('MongoDB connected for seeding societies');

    await mongoose.connection.db.dropDatabase();
    console.log('Database dropped successfully');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('12345678', salt);

    const sampleSocieties = [
      {
        name: 'Computer Science Society',
        description: 'Society for all computer science and IT students.',
        email: 'cs.society@university.edu',
        password: hashedPassword,
        ratings: 5.0
      },
      {
        name: 'Drama Club',
        description: 'For students passionate about theater and performance arts.',
        email: 'drama.club@university.edu',
        password: hashedPassword,
        ratings: 4.5
      },
      {
        name: 'Business Society',
        description: 'Society focused on entrepreneurship and business management.',
        email: 'business.society@university.edu',
        password: hashedPassword,
        ratings: 4.8
      },
      {
        name: 'Cultural Society',
        description: 'Promoting cultural awareness and diversity on campus.',
        email: 'cultural.society@university.edu',
        password: hashedPassword,
        ratings: 4.7
      }
    ];

    await Society.insertMany(sampleSocieties);
    console.log('Sample societies data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding societies data:', error);
    process.exit(1);
  }
};

seedSocieties();
