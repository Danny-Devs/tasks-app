import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";

// Define the 'tasks' table schema for SQLite using Drizzle ORM
export const tasks = sqliteTable("tasks", {
	id: int().primaryKey({ autoIncrement: true }),
	title: text().notNull(),
	done: int({ mode: "boolean" }).notNull().default(false),
	createdAt: int().$defaultFn(() => Date.now()),
	updatedAt: int().$defaultFn(() => Date.now()).$onUpdate(() => Date.now()),
});

// Create a Zod schema for validating task inserts, with title length constraints
export const InsertTasksSchema = createInsertSchema(
	tasks, {
		title: field => field.min(1).max(500),
	},
).omit({
	id: true,
	createdAt: true,
	updatedAt: true,
});

// Create a partial schema for patch (update) operations
export const PatchTasksSchema = InsertTasksSchema.partial();
