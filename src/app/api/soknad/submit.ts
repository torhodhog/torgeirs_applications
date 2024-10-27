import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

export default async function submitApplication(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = new MongoClient(process.env.MONGODB_URI || '');
    await client.connect();
    const db = client.db('thh_applications');

    const { navn, epost, beskrivelse, soknadstype, firma, belop, kontonummer, tillatelsestype, begrunnelse, userId } = req.body;

    const soknad = {
      navn,
      epost,
      beskrivelse,
      soknadstype,
      status: 'innsendt',
      opprettetDato: new Date(),
      userId: new ObjectId(userId),
      firma,
      belop: soknadstype === 'okonomi' ? parseInt(belop) : undefined,
      kontonummer: soknadstype === 'okonomi' ? kontonummer : undefined,
      tillatelsestype: soknadstype === 'tillatelse' ? tillatelsestype : undefined,
      begrunnelse,
    };

    const result = await db.collection('soknader').insertOne(soknad);
    res.status(201).json(result);

    await client.close();
  } catch (error) {
    console.error('Feil ved innsending av søknad:', error);
    res.status(500).json({ message: 'Feil ved innsending av søknad' });
  }
}
