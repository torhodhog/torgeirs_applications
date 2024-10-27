import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

export default async function loginUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db('thh_applications');

    const { username, password } = req.body;

    // Finn brukeren basert på brukernavn
    const user = await db.collection('users').findOne({ username });
    if (!user) {
      res.status(401).json({ message: 'Feil brukernavn eller passord' });
      return;
    }

    // Sammenlign passordet med hashed passord lagret i databasen
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Feil brukernavn eller passord' });
      return;
    }

    res.status(200).json({ message: 'Du er logget inn', user });
  } catch (error) {
    console.error('Feil ved innlogging:', error);
    res.status(500).json({ message: 'Feil ved innlogging' });
  }
}
