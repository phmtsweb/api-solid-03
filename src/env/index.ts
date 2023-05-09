import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().default(3333),
  MAX_DISTANCE: z.coerce.number().default(0.1),
  MAX_RESULTS_PER_PAGE: z.coerce.number().default(20),
  MAX_MINUTES_TO_VALIDATE_CHECK_IN: z.coerce.number().default(20),
  JWT_SECRET: z.string(),
})

export const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.log('❌ Invalid environment variables', _env.error.format())
  throw new Error('Invalid environment variables')
}

export const env = _env.data
