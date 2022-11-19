<script lang="ts">
	import { listen } from "@tauri-apps/api/event";
	import NotifyContainer from "./lib/components/containers/notifications/notify-container.svelte";
	import { onMount } from "svelte";
	import FileArea from "./lib/components/layout/file-area/file-area.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
	import { FileEvents, InvokeHandler } from "./lib/events/events";
	import { FolderStoreAction } from "./lib/store/store";
	import { NotificationStoreActions } from "./lib/store/store/notifications";
	import SaveModal from "./lib/components/specific/save-modal.svelte";
	import { invoke } from "@tauri-apps/api/tauri";

	let existFolder = false;

	onMount(async () => {
		try {
			let result = await invoke<string>(InvokeHandler.getCacheInfo);
			if (result.length > 0) {
				await FolderStoreAction.readFolderCache(result);
				existFolder = true;
			}
		} catch (e) {
			console.log("error: ", e);
		}

		const handleReadFile = async () => {
			try {
				let result = await FolderStoreAction.OpenFolder();
				await invoke(InvokeHandler.savePathToCache, { url: result });
				existFolder = true;
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
</script>

<main class="grid" style="height: 100%;">
	<Sidebar bind:existFolder />
	<FileArea />
</main>
<NotifyContainer />

<SaveModal />

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
