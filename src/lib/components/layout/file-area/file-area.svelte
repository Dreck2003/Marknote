<script lang="ts">
	import { saveFile } from "../../../utils/files/files";
	import {
		FileReaderActions,
		FileReaderStore,
		FolderStoreAction,
		MarkdownStore,
		MarkdownStoreActions,
		NotificationStoreActions,
	} from "../../../store/store";
	import CodeArea from "../../specific/code-area/code_area.svelte";
	import TopBar from "../../bars/top-bar.svelte";
	import MarkdowView from "../../specific/render-markdown/markdow-view.svelte";
	import FileIcon from "../../svg/file-icon.svelte";
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
				NotificationStoreActions.add({
					type: "Danger",
					content: "Error to save file",
				});
			});
	};
	const handleConvertMarkdown = () => {
		MarkdownStoreActions.convertMarkDown()
			.then((content) => {
				$MarkdownStore.visible = true;
			})
			.catch((e) => {
				NotificationStoreActions.add({
					type: "Danger",
					content: "Cannot convert this file to view",
				});
			});
	};
</script>

<section class="File_Area" tabindex="-1">
	{#if $FileReaderStore.isEmpty}
		<div class="Empty-Area flex flex-c flex-d-c">
			<h3 class="text-green-300">Choose a file</h3>
			<FileIcon
				svgProps={{ height: "8em", width: "8em" }}
				className="fill-green-200 stroke-green-300"
			/>
		</div>
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
		overflow: auto;
	}

	.Empty-Area {
		width: 100%;
		height: 100%;
	}

	:global(.Section-Code) {
		margin-top: 0.4em;
	}
</style>
