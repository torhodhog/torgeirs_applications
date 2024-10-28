import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId, Db } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');
let db: Db | null = null;

async function connectToDatabase() {
  if (!db) {
    await client.connect();
    db = client.db('thh_applications');
  }
  return db;
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // Henter ID direkte fra URL-slutten
    
    if (!id) {
      return NextResponse.json({ message: 'ID mangler i forespørselen' }, { status: 400 });
    }

    const db = await connectToDatabase();
    const collection = db.collection('soknader');
    
    const application = await collection.findOne({ _id: new ObjectId(id) });
    
    if (!application) {
      return NextResponse.json({ message: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Feil ved henting av søknad:', error);
    return NextResponse.json({ message: 'Feil ved henting av søknad' }, { status: 500 });
  }
}

