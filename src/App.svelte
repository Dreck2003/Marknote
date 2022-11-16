<script lang="ts">
	import { listen } from "@tauri-apps/api/event";
	import NotifyContainer from "./lib/components/containers/notifications/notify-container.svelte";
	import { onMount } from "svelte";
	import FileArea from "./lib/components/layout/file-area/file-area.svelte";
	import MarkdowView from "./lib/components/specific/render-markdown/markdow-view.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
	import { FileEvents } from "./lib/events/events";
	import { FolderStoreAction } from "./lib/store/store";
	import { NotificationStoreActions } from "./lib/store/store/notifications";

	onMount(async () => {
		const handleReadFile = async () => {
			try {
				await FolderStoreAction.OpenFolder();
			} catch (error) {
				NotificationStoreActions.add({
					type: "Warning",
					content: "Could not open the folder",
				});
			}
		};

		const unlisten = await listen(FileEvents.OpenFolder, handleReadFile);
		return () => {
			unlisten();
		};
	});

	let seeMarkdown = false;
	let markdown = "";
</script>

<main class="grid" style="height: 100%;">
	<Sidebar />
	{#if seeMarkdown}
		<MarkdowView bind:markdown />
	{:else}
		<FileArea />
	{/if}
</main>
<NotifyContainer />

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
