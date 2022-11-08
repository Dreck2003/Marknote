<script lang="ts">
	import Folder from "../../common/accordion/folder/folder.svelte";
	import ShadowFolder from "../../common/accordion/folder/shadow-folder.svelte";
	import { FolderStore } from "../../../store/store";
	import FolderMenu from "../../common/menu/folder/folder-menu.svelte";
	import { writable } from "svelte/store";
	let y = 0;
	const handleClickFolder = (e: MouseEvent, height: number) => {
		y = Math.trunc(e.pageY / (height * 1.1)) * height;
	};

	let folderMenu = writable({
		y: 0,
		visible: false,
		folderId: Symbol(null),
		path: "",
		title: "",
	});
	const handleShowMenu = (
		e: MouseEvent,
		folder: { id: symbol; path: string; title: string }
	) => {
		if (folder.id === $folderMenu.folderId) {
			$folderMenu.visible = !$folderMenu.visible;
			return;
		}
		$folderMenu.visible = true;
		$folderMenu.folderId = folder.id;
		$folderMenu.path = folder.path;
		$folderMenu.title = folder.title;
		let target = e.target as HTMLElement;
		$folderMenu.y = target.getBoundingClientRect().y + 10;
	};
</script>

<section class="Sidebar bg-gray-100">
	<div>
		<!--folder principal, create files, folders HERE  -->
	</div>
	<div style="position: relative;">
		<ShadowFolder bind:y style="transform: translate(0px,{y ?? 0}px);" />
		<Folder
			expanded
			content={$FolderStore}
			click={handleClickFolder}
			{handleShowMenu}
		/>
		<FolderMenu id="folder-menu" bind:folderMenu />
	</div>
</section>

<style>
	.Sidebar {
		padding-top: 0.5em;
	}
</style>
