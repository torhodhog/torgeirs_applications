import { NextRequest, NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { status } = await req.json();

    await client.connect();
    const db = client.db('thh_applications');
    const collection = db.collection('soknader');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: 'Søknad ikke funnet eller ingen endringer gjort' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Søknadsstatus oppdatert' }, { status: 200 });
  } catch (error) {
    console.error('Feil ved oppdatering av søknadsstatus:', error);
    return NextResponse.json({ message: 'Feil ved oppdatering av søknadsstatus' }, { status: 500 });
  }
}
