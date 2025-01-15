import { z } from 'zod';

export const configSchema = z.object({
  DATABASE_URL: z.string(),
  COINBASE_KEY_NAME: z.string(),
  COINBASE_KEY_SECRET: z.string(),
  PORT: z.string().optional(),
});

export type Config = z.infer<typeof configSchema>;
