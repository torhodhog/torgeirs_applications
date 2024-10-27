import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');

// @ts-ignore - Ignorerer feilen knyttet til params her
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await client.connect();
    const db = client.db('thh_applications');
    const collection = db.collection('soknader');
    
    // Bruker `params.id` som en ObjectId for å hente dokumentet
    const application = await collection.findOne({ _id: new ObjectId(params.id) });
    
    if (!application) {
      return NextResponse.json({ message: 'Søknad ikke funnet' }, { status: 404 });
    }

    return NextResponse.json(application, { status: 200 });
  } catch (error) {
    console.error('Feil ved henting av søknad:', error);
    return NextResponse.json({ message: 'Feil ved henting av søknad' }, { status: 500 });
  }
}
