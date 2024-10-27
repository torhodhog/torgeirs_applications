import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let client: MongoClient | null = null;

// Funksjon for å koble til MongoDB og gjenbruke tilkoblingen
async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db('thh_applications');
}

// POST forespørsel for å legge til en ny søknad
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Mottatt data for innsending:", body); // Logg innsendingen for feilsøking
    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const result = await collection.insertOne(body);
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Feil ved innsending av søknad:", error);
    return NextResponse.json({ error: 'Feil ved innsending av søknad' }, { status: 500 });
  }
}

// GET forespørsel for å hente alle søknader
export async function GET() {
  try {
    console.log("Henter søknader fra databasen"); // Logg for feilsøking
    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const soknader = await collection.find().toArray();
    return NextResponse.json(soknader, { status: 200 });
  } catch (error) {
    console.error("Feil ved henting av søknader:", error);
    return NextResponse.json({ error: 'Feil ved henting av søknader' }, { status: 500 });
  }
}
