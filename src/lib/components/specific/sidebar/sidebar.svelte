<script lang="ts">
	import Folder from "../../common/accordion/folder/folder.svelte";
	import ShadowFolder from "../../common/accordion/folder/shadow-folder.svelte";
	import { FolderStore } from "../../../store/store";
	import FolderMenu from "../../common/menu/folder-menu.svelte";
	import {
		FolderMenuState,
		FileMenuState,
		FolderMenuActions,
		FileMenuActions,
	} from "../../../store/store/menus";
	import type { FileContent } from "../../../interfaces/files/files";
	import FileMenu from "../../common/menu/file-menu.svelte";
	let y = 0;
	const handleClickFolder = (e: MouseEvent, height: number) => {
		y = Math.trunc(e.pageY / (height * 1.1)) * height;
	};

	let visibleMenu = { folder: false, file: false };

	const handleFolderMenu = (
		e: MouseEvent,
		folder: { id: symbol; path: string; title: string }
	) => {
		visibleMenu.file = false;
		FileMenuActions.reset();
		if (!$FolderMenuState.folderId || folder.id !== $FolderMenuState.folderId) {
			!visibleMenu.folder && (() => (visibleMenu.folder = true))();
			let target = e.target as HTMLElement;
			return FolderMenuState.update((f) => ({
				folderId: folder.id,
				path: folder.path,
				title: folder.title,
				y: target.getBoundingClientRect().y + 10,
			}));
		}
	};

	const handleFileMenu = (
		e: MouseEvent,
		folderId: symbol,
		file: FileContent
	) => {
		visibleMenu.folder = false;
		FolderMenuActions.reset();
		if (!$FileMenuState.fileId || $FileMenuState.fileId !== file.id) {
			!visibleMenu.file && (() => (visibleMenu.file = true))();
			let target = e.target as HTMLElement;
			return FileMenuState.update((f) => ({
				...f,
				fileId: file.id,
				folderId,
				y: target.getBoundingClientRect().y + 10,
				path: file.path,
				title: file.name,
			}));
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
			{handleFolderMenu}
			{handleFileMenu}
		/>
		<FolderMenu
			bind:visible={visibleMenu.folder}
			on:outclick={() => {
				visibleMenu.folder = false;
				FolderMenuActions.reset();
			}}
		/>
		<FileMenu
			bind:visible={visibleMenu.file}
			on:outclick={() => {
				visibleMenu.file = false;
				FileMenuActions.reset();
			}}
		/>
	</div>
</section>

<style>
	.Sidebar {
		padding-top: 0.5em;
	}
</style>
