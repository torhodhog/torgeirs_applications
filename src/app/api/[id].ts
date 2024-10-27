import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Søknad-ID er påkrevd' });
  }

  const client = new MongoClient(process.env.MONGODB_URI || '');
  await client.connect();
  const db = client.db('thh_applications');

  try {
    if (req.method === 'GET') {
      const application = await db.collection('soknader').findOne({ _id: new ObjectId(id) });
      if (!application) {
        return res.status(404).json({ message: 'Søknad ikke funnet' });
      }
      res.status(200).json(application);
    } else if (req.method === 'PATCH') {
      const { status, feedback } = req.body;
      const result = await db.collection('soknader').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, feedback } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Søknad ikke funnet' });
      }

      res.status(200).json({ message: `Søknad ${status.toLowerCase()}!`, result });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Feil ved henting/oppdatering av søknad:', error);
    res.status(500).json({ message: 'Feil ved henting/oppdatering av søknad' });
  } finally {
    await client.close();
  }
}
