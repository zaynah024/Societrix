import dotenv from 'dotenv';
import connection from "./config/db.mjs";
import express from 'express';
import societyRoutes from './routes/societyRoutes.mjs';
import cors from 'cors';

dotenv.config();
connection();

const app = express();
app.use(cors());
app.use(express.json());

app.use(societyRoutes);

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message); // Log the error
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});