import type { CreateExampleUseCase } from '../../Application/CreateExampleUseCase';
import { ExampleAlreadyExistsException } from '../../Domain/Exception/ExampleException';

// Adapter primaire HTTP — reçoit Request, appelle le use case, retourne Response
// TODO: Rename to match the aggregate/feature
export class ExampleController {
  constructor(private readonly createExample: CreateExampleUseCase) {}

  async handleCreate(request: Request): Promise<Response> {
    try {
      // TODO: Validate request body with Zod (or similar) before trusting it.
      // NEVER use `as` to cast external input — it bypasses all type safety.
      // e.g. const body = CreateExampleSchema.parse(await request.json());
      const body = await request.json() as { id: string };

      await this.createExample.execute({ id: body.id });
      return new Response(null, { status: 201 });
    } catch (error) {
      if (error instanceof ExampleAlreadyExistsException) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      throw error;
    }
  }
}
