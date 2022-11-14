<script lang="ts">
	import File from "./file.svelte";
	import type { FolderContent } from "../../../../interfaces/files/files";
	import {
		getFileDataForMenu,
		getFolderDataForMenu,
		type FileMenuProps,
		type FolderMenuProps,
	} from "../../../../store/store/menus";
	import FolderOpenCloseIcon from "./folder-open-close-icon.svelte";
	export let content: FolderContent;
	export let expanded = false;
	export let isRoot = false;
	export let click = (e: MouseEvent, height: number) => {};
	export let handleFolderMenu = (e: MouseEvent, folder: FolderMenuProps) => {};
	export let parentFolders: string[];
	export let handleFileMenu = (
		e: MouseEvent,
		folderId: symbol,
		file: FileMenuProps
	) => {};
	const handleClickFolder = (e: MouseEvent) => {
		click(e, 30);
	};

	const cellHeight = 30;
</script>

<div class="Folder_Content" on:click={handleClickFolder} on:keydown>
	<header
		on:click={() => (expanded = !expanded)}
		on:keydown
		on:focus
		on:contextmenu={(e) => {
			e.preventDefault();
			handleFolderMenu(e, getFolderDataForMenu(content, parentFolders));
		}}
		class="grid a-i-center"
		style:pointer-events={content.files || content.folders ? "auto" : "none"}
		style:--cell-height={cellHeight}
	>
		<span class="flex-c">
			<FolderOpenCloseIcon bind:expanded />
		</span>
		<span class="ellipsis fs-300 bold text-gray-600">
			{content.title}
		</span>
	</header>
	{#if expanded}
		<section
			class="Folder_Section"
			class:root={isRoot}
			class:NotRoot={!isRoot}
			style:--files={cellHeight * (content.files.length ?? 0) + "px"}
		>
			{#if content.folders.length}
				{#each content.folders as folder}
					<svelte:self
						content={{ ...folder }}
						padding
						{handleFolderMenu}
						{handleFileMenu}
						parentFolders={content.folders.map(({ title }) => title)}
					/>
				{/each}
			{/if}
			{#if content.files.length}
				{#each content.files as file}
					<File
						className="fs-200 text-gray-600"
						{...file}
						folderId={content.id}
						on:contextmenu={(e) => {
							e.preventDefault();
							handleFileMenu(
								e,
								content.id,
								getFileDataForMenu(
									file,
									content.files.map(({ name }) => name)
								)
							);
						}}
					/>
				{/each}
			{/if}
		</section>
	{/if}
</div>

<style>
	.Folder_Content {
		max-width: 100%;
		position: relative;
		user-select: none;
		width: 100%;
	}

	.Folder_Content > header {
		cursor: pointer;
		grid-template-columns: 20% 60% 20%;
		height: var(--cell-height) px;
	}
	:global(.Wrapper_Menu) {
		display: flex;
	}

	.Folder_Section {
		margin-left: 0.9em;
		position: relative;
	}

	.Folder_Section.NotRoot {
		border-left: 1px dashed gray;
	}
</style>
