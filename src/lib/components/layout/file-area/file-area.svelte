<script lang="ts">
	import { saveFile } from "../../../utils/files/files";
	import {
		FileReaderActions,
		FileReaderStore,
		FolderStoreAction,
		MarkdownStore,
		MarkdownStoreActions,
	} from "../../../store/store";
	import CodeArea from "../../specific/code-area/code_area.svelte";
	import TopBar from "../../bars/top-bar.svelte";
	import MarkdowView from "../../specific/render-markdown/markdow-view.svelte";
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
	const handleConvertMarkdown = () => {
		MarkdownStoreActions.convertMarkDown()
			.then((content) => {
				$MarkdownStore.visible = true;
			})
			.catch((e) => {
				console.log("error: ", e);
			});
	};
</script>

<section class="File_Area" tabindex="-1">
	{#if $FileReaderStore.isEmpty}
		<b>Not File Selected</b>
	{:else}
		<section>
			<TopBar
				bind:isWrite={$MarkdownStore.visible}
				on:seeMarkdown={() => {
					handleConvertMarkdown();
				}}
				on:writeFile={() => {
					MarkdownStoreActions.reset();
				}}
				on:closeFile={() => {
					FileReaderActions.reset();
					MarkdownStoreActions.reset();
				}}
			/>
			{#if $MarkdownStore.visible}
				<MarkdowView bind:markdown={$MarkdownStore.content} />
			{:else}
				<CodeArea
					value={$FileReaderStore.content ?? ""}
					on:save={handleSaveFile}
				/>
			{/if}
		</section>
	{/if}
</section>

<style>
	.File_Area {
		max-height: 100vh;
		height: 100vh;
		overflow: scroll;
	}
</style>
