import db from "~/lib/db"; // Import the Drizzle ORM database client
import { tasks, InsertTasksSchema } from "~/lib/db/schema"; // Import the tasks table schema and Zod insert schema

export default defineEventHandler(async (event) => {
	// Parse and validate the request body using Zod
	const result = await readValidatedBody(event, InsertTasksSchema.safeParse);

	// If validation fails, return a 400 error
	if (!result.success) {
		return sendError(event, createError({
			statusCode: 422,
			statusMessage: "Invalid task",
		}));
	}
	// Insert the new task into the database with timestamps
	const [createdTask] = await db.insert(tasks).values({
		...result.data, // Spread validated task data
		createdAt: Date.now(), // Set creation timestamp
		updatedAt: Date.now(), // Set update timestamp
	}).returning(); // Return the inserted task

	// Return the created task as the response
	return createdTask;
});
