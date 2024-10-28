import { NextApiRequest, NextApiResponse } from 'next';
import createUser from '../src/app/api/create';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongoClient } from 'mongodb';

let mongoServer: MongoMemoryServer;
let client: MongoClient;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  // Setter MONGODB_URI miljøvariabel for testen
  process.env.MONGODB_URI = uri;

  client = new MongoClient(uri);
  await client.connect();
});

afterAll(async () => {
  await client.close();
  await mongoServer.stop();
});

describe('API Test - Create User', () => {
  it('should create a new user', async () => {
    const req = {
      method: 'POST',
      body: { username: 'testuser', password: 'password123', role: 'user' },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await createUser(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Bruker opprettet',
        user: expect.objectContaining({ username: 'testuser' }),
      })
    );
  });

  it('should not allow duplicate usernames', async () => {
    const req = {
      method: 'POST',
      body: { username: 'testuser', password: 'password123', role: 'user' },
    } as NextApiRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as NextApiResponse;

    await createUser(req, res); // Første forsøk, skal fungere
    await createUser(req, res); // Andre forsøk, skal feile med 400

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Bruker finnes allerede' });
  });
});
