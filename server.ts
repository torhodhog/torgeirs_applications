import express from 'express';
import next from 'next';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import soknadRoutes from './src/routes/soknad';
import userRouter from './src/routes/userRoutes';

dotenv.config();

console.log("NODE_ENV:", process.env.NODE_ENV);  // Bekreft miljø
console.log("MONGODB_URI:", process.env.MONGODB_URI);  // Bekreft MongoDB URI

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hogheim:2uK9xqZqHXpdTM2C@cluster0.t5cw8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.prepare().then(() => {
  console.log("Next.js app prepared");  // Bekreft Next.js-oppstart

  const server = express();
  server.use(express.json());

  const client = new MongoClient(MONGODB_URI);
  client.connect()
    .then(() => {
      console.log('Connected to MongoDB');
      const db = client.db('thh_applications');
      server.locals.db = db;

      // API-ruter
      server.use('/api', soknadRoutes);
      server.use('/api/users', userRouter);

      // Håndter alle Next.js-ruter
      server.all('*', (req, res) => {
        console.log("Handling request:", req.url);  // Debug: Viser alle forespørsler til Next.js
        return handle(req, res);
      });

      // Start serveren
      server.listen(port, (err?: any) => {
        if (err) throw err;
        console.log(`Server running on http://localhost:${port}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to MongoDB', err);
    });
});
