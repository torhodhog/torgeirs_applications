
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
    
    
    const generateTypeId = (type: string) => {
      const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      return `${type}-${randomId}`;
    };

    // Generer en unik type_id basert på søknadstypen
    const type_id = generateTypeId(body.soknadstype);

    const soknad = {
      _id: new ObjectId(),
      navn: body.navn || '',
      epost: body.epost || '',
      beskrivelse: body.beskrivelse || '',
      soknadstype: body.soknadstype || '',
      type_id, // Legg til type_id her
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


