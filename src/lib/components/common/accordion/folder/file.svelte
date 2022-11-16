<script lang="ts">
	import FileIcon from "../../../svg/file-icon.svelte";
	import { COLORS } from "../../../../interfaces/styles/index";
	import {
		FileReaderStore,
		MarkdownStore,
		MarkdownStoreActions,
		NotificationStoreActions,
	} from "../../../../store/store";
	export let name = "";
	export let content = "";
	export let path = "";
	export let folderId = Symbol(null);
	export let id: symbol = Symbol("");
	export let className = "";
	const handleClick = () => {
		if ($FileReaderStore.id != id) {
			FileReaderStore.set({
				name,
				isEmpty: false,
				content,
				path,
				id,
				folderId,
			});
			if ($MarkdownStore.visible) {
				MarkdownStoreActions.convertMarkDown().catch((e) => {
					NotificationStoreActions.add({
						type: "Danger",
						content: "Cannot convert this file to view",
					});
				});
			}
		}
	};
</script>

<div
	class="Folder_Content-File flex a-i-center {className}"
	style:--clr-green-300={`hsla(${COLORS["Green300"]},20%)`}
	on:click={handleClick}
	on:keydown
	on:contextmenu
	style:background-color={$FileReaderStore.id === id
		? `hsla(${COLORS["Green300"]},20%)`
		: "inherit"}
>
	<FileIcon
		svgProps={{ width: 17, height: 17 }}
		className="fill-gray-400 stroke-gray-100"
	/>
	<span class="ellipsis">{name}</span>
</div>

<style>
	.Folder_Content-File {
		--gap: 0.2em;
		border-radius: 6px;
		cursor: pointer;
		height: 30px;
		padding-left: 0.5em;
	}
	/* .Folder_Content-File:hover {
		background-color: var(--clr-green-300);
	} */
</style>
