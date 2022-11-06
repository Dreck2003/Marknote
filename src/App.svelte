<script lang="ts">
	import { listen } from "@tauri-apps/api/event";
	import { onMount } from "svelte";
	import FileArea from "./lib/components/layout/file-area/file-area.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
	import { FileEvents } from "./lib/events/events";
	import { OpenFolderEvent } from "./lib/events/file-events";
	import type { FolderContent } from "./lib/interfaces/files/files";
	import { FolderStore } from "./lib/store/store";

	let folderContent = FolderStore;

	onMount(async () => {
		const handleReadFile = async () => {
			try {
				$folderContent = await OpenFolderEvent();
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
	console.log(folderContent);
</script>

<main class="grid" style="height: 100%;">
	<Sidebar folderContent={$folderContent} />
	<FileArea />
</main>

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
