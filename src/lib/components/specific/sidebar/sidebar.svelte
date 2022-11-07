<script lang="ts">
	import Folder from "../../common/accordion/folder/folder.svelte";
	import ShadowFolder from "../../common/accordion/folder/shadow-folder.svelte";
	import { FolderStore } from "../../../store/store";
	import FolderMenu from "../../common/accordion/folder/folder-menu.svelte";
	import { MenuOptionsFolder } from "../../../interfaces/files/folder-menu";
	import { createFolder } from "../../../utils/files/files";
	let y = 0;
	const handleClickFolder = (e: MouseEvent, height: number) => {
		y = Math.trunc(e.pageY / (height * 1.1)) * height;
	};

	let folderMenu = {
		y: 0,
		visible: false,
		folderId: Symbol(null),
		path: "",
		title: "",
	};
	const handleShowMenu = (
		e: MouseEvent,
		folder: { id: symbol; path: string; title: string }
	) => {
		if (folder.id === folderMenu.folderId) {
			console.log("change visible");
			folderMenu.visible = !folderMenu.visible;
			return;
		}
		folderMenu.visible = true;
		folderMenu.folderId = folder.id;
		folderMenu.path = folder.path;
		folderMenu.title = folder.title;
		let target = e.target as HTMLElement;
		folderMenu.y = target.getBoundingClientRect().y + 10;
	};
	const handleClickMenu = (e: MouseEvent) => {
		let target = e.target as HTMLElement;
		folderMenu.visible = false;

		switch (target.id) {
			case MenuOptionsFolder.createFolder:
				createFolder(folderMenu.path, "NEW FOlDER");
				break;
			case MenuOptionsFolder.deleteFolder:
				break;
			case MenuOptionsFolder.renameFolder:
				break;
			case MenuOptionsFolder.createFile:
				break;
		}
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
		<FolderMenu
			id="folder-menu"
			visible={folderMenu.visible}
			y={folderMenu.y + "px"}
			on:click={handleClickMenu}
		/>
	</div>
</section>

<style>
	.Sidebar {
		padding-top: 0.5em;
	}
</style>
