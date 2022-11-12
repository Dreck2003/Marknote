<script lang="ts">
	import { listen } from "@tauri-apps/api/event";
	import { onMount } from "svelte";
	import FileArea from "./lib/components/layout/file-area/file-area.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
	import { FileEvents } from "./lib/events/events";
	import { FolderStoreAction } from "./lib/store/store";

	onMount(async () => {
		const handleReadFile = async () => {
			try {
				await FolderStoreAction.OpenFolder();
			} catch (error) {
				alert("Not posible open files");
				console.log({ error });
			}
		};

		const unlisten = await listen(FileEvents.OpenFolder, handleReadFile);
		return () => {
			unlisten();
		};
	});

	let seeMarkdown = false;
	let markdown = "<div>ESTE ES UN <b>  DIV</b></div>";
</script>

<main class="grid" style="height: 100%;">
	<Sidebar bind:seeMarkdown bind:markdown />
	{#if seeMarkdown}
		<div style="border: 2px soldid rebeccapurple;">
			{@html markdown}
		</div>
	{:else}
		<FileArea />
	{/if}
</main>

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
