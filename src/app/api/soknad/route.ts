import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MONGODB_URI || '');

export async function GET() {
  try {
    const db = client.db('thh_applications');
    const collection = db.collection('soknader');
    const soknader = await collection.find().toArray();
    return NextResponse.json(soknader, { status: 200 });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: 'Error fetching applications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const db = client.db('thh_applications');
    const collection = db.collection('soknader');
    const result = await collection.insertOne(body);
    return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: 'Error creating application' }, { status: 500 });
  }
}
