<script setup lang="ts">
const { data: tasks, error, status } = await useFetch("/api/tasks", {
	lazy: true,
});
</script>

<template>
	<div>
		<article
			v-if="status === 'pending'"
			aria-busy="true"
		/>
		<article
			v-else-if="error"
			class="error"
		>
			{{ error.statusMessage }}
		</article>
		<div v-else>
			<article
				v-for="task in tasks"
				:key="task.id"
			>
				<span>{{ task.title }}</span>
			</article>
		</div>
	</div>
</template>
