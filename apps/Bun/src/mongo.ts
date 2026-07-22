import { type Db, MongoClient } from 'mongodb';

let client: MongoClient | null = null;

export async function connectMongo(): Promise<Db> {
  const url = process.env['DATABASE_URL'];
  if (url === undefined || url.length === 0) {
    throw new Error('DATABASE_URL is not set');
  }

  client = new MongoClient(url);
  await client.connect();

  return client.db();
}

export async function closeMongo(): Promise<void> {
  await client?.close();
  client = null;
}
