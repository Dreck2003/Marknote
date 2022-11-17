<script lang="ts">
	import { createEventDispatcher } from "svelte";

	export let value = "";

	const dispatcher = createEventDispatcher();

	const handleKeydown = (e: KeyboardEvent) => {
		const value = (e.target as HTMLTextAreaElement).value;
		if (e.key == "s" && e.ctrlKey) {
			dispatcher("save", {
				content: value,
			});
		}
	};
	const handleInput = (e: Event) => {
		const value = (e.target as HTMLTextAreaElement).value;
		dispatcher("change", value);
	};
</script>

<div class="Editor-Area">
	<textarea
		name="coder"
		bind:value
		autocomplete="off"
		autocapitalize="off"
		autocorrect="off"
		spellcheck={false}
		wrap="off"
		on:blur
		acceptcharset="ut-f8"
		on:keydown={handleKeydown}
		on:input={handleInput}
	/>
</div>

<style>
	.Editor-Area {
		width: 100%;
		height: calc(100vh - 40px);
	}

	textarea {
		width: 100%;
		height: 100%;
		font-size: 0.95rem;
		outline: 0;
		padding: 0.6em;
		border: 0;
	}

	textarea::selection {
		background-color: #9cadcd6c;
	}

	textarea::-webkit-scrollbar {
		width: 0.4em;
		height: 0.4em;
	}
	textarea::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 4px;
	}
	textarea::-webkit-scrollbar-track {
		background: #e1e1e1;
		border-radius: 4px;
	}
</style>
