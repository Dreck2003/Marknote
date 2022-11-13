<script lang="ts">
	import Folder from "../../common/accordion/folder/folder.svelte";
	import ShadowFolder from "../../common/accordion/folder/shadow-folder.svelte";
	import { FileReaderActions, FolderStore } from "../../../store/store";
	import FolderMenu from "../../common/menu/folder-menu.svelte";
	import {
		FolderMenuState,
		FileMenuState,
		FolderMenuActions,
		FileMenuActions,
		type FileMenuProps,
		type FolderMenuProps,
	} from "../../../store/store/menus";
	import FileMenu from "../../common/menu/file-menu.svelte";
	let y = 0;
	export let seeMarkdown = false;
	export let markdown: string;
	const handleClickFolder = (e: MouseEvent, height: number) => {
		y = Math.trunc(e.pageY / (height * 1.1)) * height;
	};

	let visibleMenu = { folder: false, file: false };

	const handleFolderMenu = (e: MouseEvent, folder: FolderMenuProps) => {
		visibleMenu.file = false;
		FileMenuActions.reset();
		if (!$FolderMenuState.folderId || folder.id !== $FolderMenuState.folderId) {
			!visibleMenu.folder && (() => (visibleMenu.folder = true))();
			let target = e.target as HTMLElement;
			return FolderMenuState.update((f) => ({
				folderId: folder.id,
				path: folder.path,
				title: folder.title,
				files: folder.files,
				folders: folder.folders,
				parentFolders: folder.parentFolders,
				y: target.getBoundingClientRect().y + 10,
			}));
		}
	};

	const handleFileMenu = (
		e: MouseEvent,
		folderId: symbol,
		file: FileMenuProps
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
				files: file.files,
				y: target.getBoundingClientRect().y + 10,
				path: file.path,
				title: file.name,
			}));
		}
	};

	const handleConvertMarkdown = () => {
		FileReaderActions.convertMarkDown()
			.then((res) => {
				seeMarkdown = !seeMarkdown;
				markdown = res;
			})
			.catch((e) => {
				console.log("error: ", e);
			});
	};
</script>

<section class="Sidebar bg-gray-100">
	<div>
		<!--folder principal, create files, folders HERE  -->
		<button on:click={handleConvertMarkdown}> See markdown </button>
	</div>
	<div style="position: relative;">
		<ShadowFolder bind:y style="transform: translate(0px,{y ?? 0}px);" />
		<Folder
			expanded
			content={$FolderStore}
			click={handleClickFolder}
			{handleFolderMenu}
			{handleFileMenu}
			parentFolders={[]}
		/>
		<FolderMenu
			bind:visible={visibleMenu.folder}
			handleOutClick={() => {
				visibleMenu.folder = false;
				FolderMenuActions.reset();
			}}
		/>
		<FileMenu
			bind:visible={visibleMenu.file}
			handleOutClick={() => {
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
