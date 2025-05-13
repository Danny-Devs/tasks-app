// Import types for Zod schema objects and raw shapes
import type { ZodObject, ZodRawShape } from "zod";

// Import the ZodError class for error handling
import { ZodError } from "zod";

// This function attempts to validate environment variables against a Zod schema
export default function tryParseEnv<T extends ZodRawShape>(
	EnvSchema: ZodObject<T>, // The Zod schema to validate against
	buildEnv: Record<string, string | undefined> = process.env, // The environment variables to validate (defaults to process.env)
) {
	try {
		// Attempt to parse and validate the environment variables
		EnvSchema.parse(buildEnv);
	}
	catch (error) {
		// If validation fails with a ZodError, format and throw a custom error listing missing values
		if (error instanceof ZodError) {
			let message = "Missing required values in .env:\n";
			error.issues.forEach((issue) => {
				message += `${issue.path[0]}\n`;
			});
			const e = new Error(message);
			e.stack = ""; // Remove stack trace for cleaner output
			throw e;
		}
		else {
			// Log any other unexpected errors
			console.error(error);
		}
	}
}
