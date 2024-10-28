// import { NextRequest, NextResponse } from 'next/server';
// import { MongoClient } from 'mongodb';
// console.log("submit.ts file loaded");

// const client = new MongoClient(process.env.MONGODB_URI || '');

// export async function GET() {
//   try {
//     const db = client.db('thh_applications');
//     const collection = db.collection('soknader');
//     const soknader = await collection.find().toArray();
//     return NextResponse.json(soknader, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching applications:", error);
//     return NextResponse.json({ error: 'Error fetching applications' }, { status: 500 });
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const body = await req.json();
//     const db = client.db('thh_applications');
//     const collection = db.collection('soknader');
//     const result = await collection.insertOne(body);
//     return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
//   } catch (error) {
//     console.error("Error creating application:", error);
//     return NextResponse.json({ error: 'Error creating application' }, { status: 500 });
//   }
// }


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

// GET forespørsel for å hente søknader
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split('/').pop();

    const db = await connectToDatabase();
    const collection = db.collection('soknader');

    if (id && ObjectId.isValid(id)) {
      console.log("Henter søknad med ID:", id);
      const application = await collection.findOne({ _id: new ObjectId(id) });

      if (!application) {
        return NextResponse.json({ error: 'Søknad ikke funnet' }, { status: 404 });
      }

      return NextResponse.json(application, { status: 200 });
    } else {
      console.log("Henter alle søknader fra databasen");
      const soknader = await collection.find().toArray();
      return NextResponse.json(soknader, { status: 200 });
    }
  } catch (error) {
    console.error("Feil ved henting av søknader:", error);
    return NextResponse.json({ error: 'Feil ved henting av søknader' }, { status: 500 });
  }
}

// POST forespørsel for å legge til en ny søknad
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Mottatt data for innsending:", body);

    const db = await connectToDatabase();
    const collection = db.collection('soknader');

    const soknad = {
      _id: new ObjectId(),
      navn: body.navn || '',
      epost: body.epost || '',
      beskrivelse: body.beskrivelse || '',
      soknadstype: body.soknadstype || '',
      status: 'innsendt',
      opprettetDato: new Date(),
      userId: body.userId ? new ObjectId(body.userId) : null,
      firma: body.firma || '',
      belop: body.soknadstype === 'okonomi' ? parseInt(body.belop) : null,
      kontonummer: body.soknadstype === 'okonomi' ? body.kontonummer : null,
      tillatelsestype: body.soknadstype === 'tillatelse' ? body.tillatelsestype : null,
      begrunnelse: body.begrunnelse || null,
      feedback: ''
    };

    console.log("Soknad object før innsending til MongoDB:", soknad);
    const result = await collection.insertOne(soknad);
    console.log("Insert result:", result);

    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Feil ved innsending av søknad:", error);
    return NextResponse.json({ error: 'Feil ved innsending av søknad' }, { status: 500 });
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
