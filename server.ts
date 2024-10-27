import express from 'express';
import next from 'next';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import soknadRoutes from './src/routes/soknad';
import userRouter from './src/routes/userRoutes';
// import soknadIdRoutes from './src/routes/soknadIdRoutes';

dotenv.config();
console.log("NODE_ENV:", process.env.NODE_ENV);  // Legg til denne
console.log("MONGODB_URI in production:", process.env.MONGO_URI);

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}
app.prepare().then(() => {
  const server = express();

  // Middleware for å håndtere JSON-inndata
  server.use(express.json());

  // MongoDB-tilkobling
  const client = new MongoClient(MONGODB_URI);
  client.connect()
    .then(() => {
      console.log('Connected to MongoDB');
      
      const db = client.db('thh_applications'); 
      server.locals.db = db;
      console.log('Database set on server', db.databaseName);


      

      // API-ruter
      server.use('/api', soknadRoutes);
      server.use('/api/users', userRouter);
      server.use('/api/applications', soknadRoutes)
      
      // Håndter Next.js sider
      server.all('*', (req, res) => {
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
