import dotenv from 'dotenv';
import connection from "./config/db.mjs";
import express from 'express';
import societyRoutes from './routes/societyRoutes.mjs';
import eventRoutes from './routes/eventRoutes.mjs'; // Added this import
import reportRoutes from './routes/reportRoutes.mjs'; // Added this import
import dashboardRoutes from './routes/dashboardRoutes.mjs'; // Import dashboard routes
import cors from 'cors';
import venueRoutes from './routes/venueRoutes.mjs'; // Import venue routes
import adminRoutes from './routes/adminRoutes.mjs'; // Import admin routes

dotenv.config();
connection();

const app = express();
app.use(cors());
app.use(express.json());

// Admin routes
app.use('/api/admin', adminRoutes);
// Society routes
app.use('/api/societies', societyRoutes);
// Event routes
app.use('/api/events', eventRoutes); // Added this route
// Report routes
app.use('/api/reports', reportRoutes); // Added this route
// Dashboard routes
app.use('/api/dashboard', dashboardRoutes);
// Venue routes
app.use('/api/venues', venueRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Log the error
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});