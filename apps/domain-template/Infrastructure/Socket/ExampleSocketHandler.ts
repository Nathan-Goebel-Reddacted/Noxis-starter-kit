import type { Socket } from 'socket.io';
import type { CreateExampleUseCase } from '../../Application/CreateExampleUseCase';

// Adapter primaire Socket.IO — écoute les events clients, appelle le use case
// TODO: Rename to match the feature
export class ExampleSocketHandler {
  constructor(private readonly createExample: CreateExampleUseCase) {}

  register(socket: Socket): void {
    socket.on('example:create', async (data: unknown, ack) => {
      // TODO: Validate `data` with Zod before trusting it — socket input is NEVER safe.
      // Without validation, a malicious client can send arbitrary payloads.
      // e.g. const command = CreateExampleSchema.parse(data);
      try {
        const { id } = data as { id: string };
        await this.createExample.execute({ id });
        ack?.({ success: true });
      } catch (error) {
        ack?.({ success: false, error: error instanceof Error ? error.message : String(error) });
      }
    });
  }
}
