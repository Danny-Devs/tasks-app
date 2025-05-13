import { eq } from "drizzle-orm";
import { z } from "zod";
import db from "~/lib/db";
import { tasks } from "~/lib/db/schema";

// Create a schema for PATCH validation
const PatchTaskSchema = z.object({
	done: z.boolean(),
});

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params?.id;

		if (!id || isNaN(Number(id))) {
			return sendError(event, createError({ statusCode: 400, statusMessage: "Invalid ID" }));
		}

		const numericId = Number(id);

		// Use readValidatedBody for consistent validation
		const result = await readValidatedBody(event, PatchTaskSchema.safeParse);

		// Check if validation succeeded
		if (!result.success) {
			return sendError(event, createError({
				statusCode: 422,
				statusMessage: "Invalid task data",
			}));
		}

		// Use the validated data
		const isDone = result.data.done;

		try {
			const [updatedTask] = await db.update(tasks)
				.set({ done: isDone, updatedAt: Date.now() })
				.where(eq(tasks.id, numericId))
				.returning();

			if (!updatedTask) {
				return sendError(event, createError({ statusCode: 404, statusMessage: "Task not found" }));
			}

			return updatedTask;
		}
		catch (dbError: unknown) {
			console.error("Database error:", dbError);
			return sendError(event, createError({
				statusCode: 500,
				statusMessage: "Database error: " + ((dbError as Error)?.message || "Unknown error"),
			}));
		}
	}
	catch (error: unknown) {
		console.error("Error updating task:", error);
		return sendError(event, createError({
			statusCode: 500,
			statusMessage: "Failed to update task: " + ((error as Error)?.message || "Unknown error"),
		}));
	}
});
