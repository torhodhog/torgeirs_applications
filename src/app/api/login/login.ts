import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';

let client: MongoClient | null = null;

// Funksjon for å opprette en delt MongoDB-klient
async function getClient() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
  }
  return client;
}

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const client = await getClient();
    const db = client.db('thh_applications');

    const user = await db.collection('users').findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'Feil brukernavn eller passord' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Feil brukernavn eller passord' }, { status: 401 });
    }

    // Fjern passordet fra brukerobjektet
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ message: 'Du er logget inn', user: userWithoutPassword });
  } catch (error) {
    console.error('Feil ved innlogging:', error);
    return NextResponse.json({ message: 'Feil ved innlogging' }, { status: 500 });
  }
}
