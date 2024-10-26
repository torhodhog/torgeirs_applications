import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';

// Funksjon for å opprette en ny bruker
export const createUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role } = req.body;
  const db = req.app.locals.db;

  try {
    // Sjekk om brukeren allerede finnes
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Bruker finnes allerede' });
      return;
    }

    // Hash passordet før lagring
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      _id: new ObjectId(),
      username,
      password: hashedPassword,
      role,
    };

    await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: 'Bruker opprettet', user: newUser });
  } catch (error) {
    console.error('Feil ved oppretting av bruker:', error);
    res.status(500).json({ message: 'Feil ved oppretting av bruker' });
  }
};

// Funksjon for innlogging
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  try {
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
};
