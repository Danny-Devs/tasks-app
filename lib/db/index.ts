import { drizzle } from "drizzle-orm/libsql/node"; // Import Drizzle ORM for SQLite/LibSQL (Node.js)

import env from "../env"; // Import validated environment variables
import * as schema from "./schema"; // Import all table schemas

// Initialize the Drizzle ORM database client
const db = drizzle({
	connection: {
		url: env.TURSO_DATABASE_URL, // Use the database URL from environment
		authToken: env.NODE_ENV === "development" ? undefined : env.TURSO_AUTH_TOKEN, // Use auth token only outside development
	},
	casing: "snake_case", // Use snake_case for database columns
	schema, // Import and use the defined schema
});

// Export the database client for use in the app
export default db;
