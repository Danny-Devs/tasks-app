<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const id = route.params.id;

// Fetch the task from the API
const { data: task, error, pending } = await useFetch(`/api/tasks/${id}`);
</script>

<template>
	<div>
		<article
			v-if="pending"
			aria-busy
		/>
		<article
			v-else-if="error"
			class="error"
		>
			Task not found or error: {{ error.data?.message || error.message }}
		</article>
		<article v-else-if="task">
			<h2>Task #{{ task.id }}</h2>
			<p><strong>Title:</strong> {{ task.title }}</p>
			<p><strong>Done:</strong> {{ task.done ? 'Yes' : 'No' }}</p>
		</article>
	</div>
</template>
