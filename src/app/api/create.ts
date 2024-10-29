// import { NextApiRequest, NextApiResponse } from 'next';
// import { MongoClient, ObjectId } from 'mongodb';
// import bcrypt from 'bcrypt';

// export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   try {
//     const client = new MongoClient(process.env.MONGODB_URI || '');
//     await client.connect();
//     const db = client.db('thh_applications');

//     const { username, password, role } = req.body;

//     const existingUser = await db.collection('users').findOne({ username });
//     if (existingUser) {
//       res.status(400).json({ message: 'Bruker finnes allerede' });
//       return;
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = {
//       _id: new ObjectId(),
//       username,
//       password: hashedPassword,
//       role,
//     };

//     await db.collection('users').insertOne(newUser);
//     res.status(201).json({ message: 'Bruker opprettet', user: newUser });

//     await client.close();
//   } catch (error) {
//     console.error('Feil ved oppretting av bruker:', error);
//     res.status(500).json({ message: 'Feil ved oppretting av bruker' });
//   }
// }
