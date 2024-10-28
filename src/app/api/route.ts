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

// GET forespørsel for å hente en spesifikk søknad basert på ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Ugyldig ID' }, { status: 400 });
    }

    console.log("Henter søknad med ID:", id); // Logg for feilsøking
    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const application = await collection.findOne({ _id: new ObjectId(id) });

    if (!application) {
      return NextResponse.json({ error: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error("Feil ved henting av søknad:", error);
    return NextResponse.json({ error: 'Feil ved henting av søknad' }, { status: 500 });
  }
}

// PATCH forespørsel for å oppdatere statusen til en søknad
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    const { status, feedback } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Ugyldig ID' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, feedback } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: `Søknad ${status.toLowerCase()}!` }, { status: 200 });
  } catch (error) {
    console.error("Feil ved oppdatering av søknad:", error);
    return NextResponse.json({ error: 'Feil ved oppdatering av søknad' }, { status: 500 });
  }
}
