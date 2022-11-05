<script lang="ts">
	import ChevronIcon from "../../../svg/chevron-icon.svelte";
	import File from "./file.svelte";
	import type { FolderContent } from "./helper.folder";
	export let content: FolderContent;
	export let expanded = false;
	export let padding = false;
	export let click = (e: MouseEvent, height: number) => {};
	const handleClickFolder = (e: MouseEvent) => {
		click(e, 30);
	};
</script>

<div class="Folder_Content" on:click={handleClickFolder} on:keydown>
	<header
		on:click={() => {
			if (content.files.length <= 0 || content.folders.length <= 0) return;
			expanded = !expanded;
		}}
		on:keydown
		class="grid a-i-center"
		style="padding-left: {padding
			? '0.7em'
			: '0em'};pointer-events:{content.files || content.folders
			? 'auto'
			: 'none'}"
	>
		<span>
			<ChevronIcon
				svgProps={{ class: "ChevronIcon flex", "stroke-width": 0.1 }}
				position={expanded ? "down" : "right"}
			/>
		</span>
		<span>
			{content.title}
		</span>
	</header>
	{#if expanded}
		<section>
			{#if content.folders.length}
				{#each content.folders as folder}
					<svelte:self content={folder} padding />
				{/each}
			{/if}
			{#if content.files.length}
				{#each content.files as file}
					<File {padding} name={file.name} />
				{/each}
			{/if}
		</section>
	{/if}
</div>

<style>
	.Folder_Content {
		width: 100%;
		max-width: 100%;
		user-select: none;
	}

	.Folder_Content > header:hover {
		background-color: #b4ccee84;
	}

	.Folder_Content > header {
		cursor: pointer;
		padding-left: 1em;
		height: 30px;
		grid-template-columns: 20% 80%;
	}
</style>
