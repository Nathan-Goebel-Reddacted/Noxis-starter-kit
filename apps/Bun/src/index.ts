import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { closeMongo, connectMongo } from './mongo';

const db = await connectMongo();
console.log('[mongo] connected');

void db;

const httpServer = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

const io = new Server(httpServer, {
  cors: {
    origin: (process.env['CORS_ORIGIN'] ?? 'http://localhost:5173').split(','),
  },
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

const PORT = Number(process.env['PORT'] ?? 3000);

httpServer.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});

const shutdown = async () => {
  io.close();
  httpServer.close();
  await closeMongo();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
