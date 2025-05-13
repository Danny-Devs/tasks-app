import { z } from "zod"; // Import Zod for schema validation

import tryParseEnv from "./try-parse-env"; // Import helper to validate env variables at startup

// Define the expected environment variables and their types using Zod
const EnvSchema = z.object({
	NODE_ENV: z.string(), // Node environment (e.g., 'development', 'production')
	TURSO_DATABASE_URL: z.string(), // Database connection URL for Turso/SQLite
	TURSO_AUTH_TOKEN: z.string(), // Auth token for the database (required in production)
});

// Export the inferred TypeScript type for the environment schema
export type EnvSchema = z.infer<typeof EnvSchema>;

// Validate environment variables at startup; throws if missing/invalid
tryParseEnv(EnvSchema);

// Parse and export the validated environment variables for use elsewhere in the app
export default EnvSchema.parse(process.env);
