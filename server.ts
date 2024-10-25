import express from 'express';
import next from 'next';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import soknadRoutes from './src/routes/soknad';

dotenv.config();

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// MongoDB connection URL
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hogheim:2uK9xqZqHXpdTM2C@cluster0.t5cw8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

app.prepare().then(() => {
  const server = express();

  // Middleware for å håndtere JSON-inndata
  server.use(express.json());

  // MongoDB-tilkobling
  const client = new MongoClient(MONGO_URI);
  client.connect()
    .then(() => {
      console.log('Connected to MongoDB');
      
      const db = client.db('thh_applications'); // Sett inn riktig database
      server.locals.db = db;
      console.log('Database set on server', db.databaseName);


      

      // API-ruter
      server.use('/api', soknadRoutes);

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
