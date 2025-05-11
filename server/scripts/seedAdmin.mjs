import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.mjs';

dotenv.config();

const seedAdmin = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to database:', connection.connection.name);

    await Admin.deleteOne({ email: 'admin@example.com' });
    console.log('Deleted existing admin user');

    const admin = new Admin({
      name: 'Admin',
      email: 'admin@example.com',
      password: 'admin123',
    });

    await admin.save();
    console.log('Admin user created successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();