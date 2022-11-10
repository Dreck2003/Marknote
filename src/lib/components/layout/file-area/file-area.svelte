<script lang="ts">
	import { saveFile } from "../../../utils/files/files";
	import { FileReaderStore, FolderStoreAction } from "../../../store/store";
	import CodeArea from "../../specific/code-area/code_area.svelte";
	const handleSaveFile = (event: CustomEvent) => {
		saveFile($FileReaderStore.path, event.detail.content)
			.then((e) => {
				$FileReaderStore.content = event.detail.content;
				FolderStoreAction.saveFile(
					$FileReaderStore.folderId,
					$FileReaderStore.id,
					event.detail.content
				);
			})
			.catch((e) => {
				console.log("error in save file");
			});
	};
</script>

<section class="File_Area" tabindex="-1">
	{#if $FileReaderStore.isEmpty}
		<b>Not File Selected</b>
	{:else}
		<CodeArea value={$FileReaderStore.content ?? ""} on:save={handleSaveFile} />
	{/if}
</section>

<style>
	.File_Area {
		max-height: 100vh;
		height: 100vh;
		overflow: scroll;
	}
</style>
