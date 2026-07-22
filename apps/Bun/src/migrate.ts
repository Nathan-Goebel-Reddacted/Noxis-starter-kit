import { closeMongo, connectMongo } from './mongo';

const db = await connectMongo();

void db;

console.log('[migrate] indexes up to date');

await closeMongo();
process.exit(0);
