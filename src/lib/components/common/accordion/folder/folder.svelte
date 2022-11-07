<script lang="ts">
	import ChevronIcon from "../../../svg/chevron-icon.svelte";
	import File from "./file.svelte";
	import type { FolderContent } from "../../../../interfaces/files/files";
	import Dots from "../../../svg/dots.svelte";
	export let content: FolderContent;
	export let expanded = false;
	export let padding = false;
	export let click = (e: MouseEvent, height: number) => {};
	export let handleShowMenu = (
		e: MouseEvent,
		folder: { id: symbol; path: string; title: string }
	) => {};
	const handleClickFolder = (e: MouseEvent) => {
		click(e, 30);
	};
	let showMenu = false;
	let showDots = false;
</script>

<div class="Folder_Content" on:click={handleClickFolder} on:keydown>
	<header
		on:click={() => {
			if (content.files.length <= 0 && content.folders.length <= 0) return;
			expanded = !expanded;
		}}
		on:keydown
		on:mouseover={() => (showDots ? null : (showDots = true))}
		on:focus
		on:mouseleave={() => {
			if (!showMenu) {
				showDots ? (showDots = false) : null;
			}
		}}
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
		<span class="ellipsis">
			{content.title}
		</span>

		<span
			class="Dots flex"
			style="visibility: {showDots ? 'visible' : 'hidden'};"
			on:click={(e) => {
				e.stopPropagation();
				handleShowMenu(e, {
					id: content.id,
					path: content.path,
					title: content.title,
				});
				showMenu = !showMenu;
			}}
			on:keydown
		>
			<Dots svgProps={{ fill: "red", class: "Dots flex" }} />
		</span>
	</header>
	{#if expanded}
		<section>
			{#if content.folders.length}
				{#each content.folders as folder}
					<svelte:self content={{ ...folder }} padding {handleShowMenu} />
				{/each}
			{/if}
			{#if content.files.length}
				{#each content.files as file}
					<File
						{padding}
						name={file.name}
						content={file.content}
						path={file.path}
						id={file.id}
						folderId={content.id}
					/>
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
		grid-template-columns: 20% 60% 20%;
	}
	:global(.Wrapper_Menu) {
		display: flex;
	}
</style>
