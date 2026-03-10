import { createServer } from 'http';
import { Server } from 'socket.io';

// TODO: Replace the raw HTTP handler below with your framework of choice (Hono, Elysia, etc.)
const httpServer = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok' }));
});

const io = new Server(httpServer, {
  cors: {
    origin: process.env['CORS_ORIGIN'] ?? 'http://localhost:5173',
  },
});

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // TODO: Register your domain socket handlers here, e.g.:
  // new ExampleSocketHandler(createExampleUseCase).register(socket);

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});

const PORT = Number(process.env['PORT'] ?? 3000);

httpServer.listen(PORT, () => {
  console.log(`[api] listening on port ${PORT}`);
});
