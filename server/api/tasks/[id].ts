import db from "~/lib/db";

export default defineEventHandler(async (event) => {
	// Get the id param from the route
	const id = event.context.params?.id;

	if (!id || isNaN(Number(id))) {
		return sendError(event, createError({ statusCode: 400, statusMessage: "Invalid ID" }));
	}

	// Query the database for the task with this id
	const task = await db.query.tasks.findFirst({
		where: (tasks, { eq }) => eq(tasks.id, Number(id)),
	});

	if (!task) {
		// Optionally, return a 404 error if not found
		return sendError(event, createError({ statusCode: 404, statusMessage: "Task not found" }));
	}

	return task;
});
