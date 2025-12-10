import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: {
    // Configure your database connection
    provider: "sqlite", // or "postgresql", "mysql", "mongodb"
    url: process.env.DATABASE_URL!,
  },
  secret: process.env.BETTER_AUTH_SECRET!,
  // Extend user model for profile information
  user: {
    additionalFields: {
      softwareExperience: {
        type: "string",
        required: false,
      },
      roboticsExperience: {
        type: "string",
        required: false,
      },
      hasRTX: {
        type: "boolean",
        required: false,
      },
      hasJetson: {
        type: "boolean",
        required: false,
      },
      hasRealRobot: {
        type: "boolean",
        required: false,
      },
      preferredLanguages: {
        type: "string",
        required: false,
      },
    },
  },
});