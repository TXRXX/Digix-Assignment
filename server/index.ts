import express, { type Request, type Response } from 'express';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!', status: 'success' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
