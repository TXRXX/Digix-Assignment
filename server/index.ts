import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';

import bookRoutes from './src/api/book.js';

mongoose.connect(`${process.env.MONGODB_URI!}`)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req: Request, res: Response) => {
  res.json({ message: 'Hello World!', status: 'success' });
});

app.use('/api/books', bookRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
