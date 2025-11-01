import express from 'express';
import studentRoutes from './routes/student.js';
import dotenv from 'dotenv';
import { client } from './config/postgess.js';
dotenv.config();

const app = express();



const PORT = process.env.PORT || 3000;
//? middleware
app.use('/api/students', studentRoutes);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});