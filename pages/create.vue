<script setup lang="ts">
import type { FetchError } from "ofetch";

const taskName = ref("");
const errorMessage = ref("");
const loading = ref(false);

const onSubmit = async () => {
	if (!taskName.value.trim()) {
		errorMessage.value = "Task name is required.";
		return;
	}
	try {
		loading.value = true;
		errorMessage.value = "";
		const result = await $fetch("/api/tasks", {
			method: "POST",
			body: {
				title: taskName.value,
			},
		});
		taskName.value = "";
		navigateTo({
			name: "tasks-id",
			params: {
				id: result.id,
			},
		});
	}
	catch (e) {
		const error = e as FetchError;
		errorMessage.value = error.statusMessage || "Unknown error occurred.";
		console.error(e);
	}
	finally {
		loading.value = false;
	}
};
</script>

<template>
	<div>
		<article
			v-if="loading"
			aria-busy
		/>
		<article
			v-else-if="errorMessage"
			class="error"
		>
			{{ errorMessage }}
		</article>
		<form @submit.prevent="onSubmit">
			<label>
				Task
				<input
					v-model="taskName"
					name="title"
					type="text"
				>
			</label>
			<div class="button-container">
				<button>Create</button>
			</div>
		</form>
	</div>
</template>
