import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'sqlite',
    url: process.env.DATABASE_URL || 'auth.db',
  },
  // Extend user schema with required fields from specification
  user: {
    schema: {
      software_exp: {
        type: 'string',
        required: false,
      },
      hardware_rtx: {
        type: 'boolean',
        required: false,
      },
      hardware_robot: {
        type: 'boolean',
        required: false,
      },
      preferred_lang: {
        type: 'string',
        required: false,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});