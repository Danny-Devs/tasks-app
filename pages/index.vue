<script setup lang="ts">
const { data: tasks, refresh } = await useFetch("/api/tasks", {
	lazy: true,
});

const toggleDone = async (task: { id: number; done: boolean }) => {
	try {
		await $fetch(`/api/tasks/${task.id}`, {
			method: "PATCH",
			body: { done: !task.done },
			headers: { "Content-Type": "application/json" },
		});
		refresh();
	}
	catch (error) {
		console.error("Error updating task:", error);
		// Optionally show user feedback
	}
};

const undoneTasks = computed(() => (tasks.value || []).filter(t => !t.done));
const doneTasks = computed(() => (tasks.value || []).filter(t => t.done));
</script>

<template>
	<div>
		<section>
			<h3>Tasks</h3>

			<article
				v-for="task in undoneTasks"
				:key="task.id"
			>
				<label class="checkbox">
					<input
						type="checkbox"
						:checked="task.done"
						@change.stop.prevent="toggleDone(task)"
					>
					<NuxtLink
						:to="`/tasks/${task.id}`"
					>
						<span>{{ task.title }}</span>
					</NuxtLink>
				</label>
			</article>
		</section>
		<section v-if="doneTasks.length">
			<h3>Done</h3>

			<article
				v-for="task in doneTasks"
				:key="task.id"
			>
				<label class="checkbox">
					<input
						type="checkbox"
						:checked="task.done"
						@change.stop.prevent="toggleDone(task)"
					>
					<NuxtLink
						:to="`/tasks/${task.id}`"
					>
						<span>{{ task.title }}</span>
					</NuxtLink>
				</label>
			</article>
		</section>
	</div>
</template>
