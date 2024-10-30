import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

let client: MongoClient | null = null;

async function connectToDatabase() {
  if (!client) {
    client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    console.log("Connected to MongoDB");
  }
  return client.db('thh_applications');
}

// Funksjon for å generere en unik type_id
const generateTypeId = (type: string) => {
  const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${type}-${randomId}`;
};

// GET forespørsel for å hente en spesifikk søknad basert på ID
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Ugyldig ID' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    console.log("Henter søknad med ID:", id);
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

// POST forespørsel for å opprette en ny søknad
export async function POST(req: NextRequest) {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const body = await req.json();

    // Generer en unik type_id basert på søknadstypen
    const type_id = generateTypeId(body.soknadstype);

    const newApplication = {
      ...body,
      type_id,
      opprettetDato: new Date(),
      status: 'innsendt',
    };

    const result = await collection.insertOne(newApplication);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Feil ved oppretting av søknad:", error);
    return NextResponse.json({ error: 'Feil ved oppretting av søknad' }, { status: 500 });
  }
}

// PATCH forespørsel for å oppdatere statusen til en søknad
export async function PATCH(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();
    console.log("ID fra URL:", id);

    const { status, feedback } = await req.json();
    console.log("Mottatt data:", { status, feedback });

    if (!id || !ObjectId.isValid(id)) {
      console.error("Ugyldig ID:", id);
      return NextResponse.json({ error: 'Ugyldig ID' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, feedback } }
    );

    console.log("Oppdateringsresultat:", result);

    if (result.matchedCount === 0) {
      console.error("Søknad ikke funnet for ID:", id);
      return NextResponse.json({ error: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: `Søknad ${status.toLowerCase()}!` }, { status: 200 });
  } catch (error) {
    console.error("Feil ved oppdatering av søknad:", error);
    return NextResponse.json({ error: 'Feil ved oppdatering av søknad' }, { status: 500 });
  }
}

// DELETE forespørsel for å slette en søknad basert på ID
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();  // Hent `id` fra body

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Ugyldig ID' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('soknader');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Søknad slettet!' }, { status: 200 });
  } catch (error) {
    console.error("Feil ved sletting av søknad:", error);
    return NextResponse.json({ error: 'Feil ved sletting av søknad' }, { status: 500 });
  }
}