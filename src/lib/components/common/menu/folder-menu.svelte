<script lang="ts">
	import { FolderStoreAction } from "../../../store/store";
	import { FolderMenuState } from "../../../store/store/menus";
	import { MenuOptionsFolder } from "../../../interfaces";
	import OptionInput from "./options/option-input.svelte";
	import { Menu, OptionMenu } from "./principal/index";
	import {
		FileNamingError,
		FolderNamingError,
		validateFileName,
		validateFolderName,
	} from "../../../utils/errors/naming-errors";

	export let visible = false;
	export let handleOutClick = () => {};

	let optionId = MenuOptionsFolder.nothing; // Nothing for default

	const handleOptionsSelected = (v: string) => {
		switch (optionId) {
			case MenuOptionsFolder.createFolder: {
				FolderStoreAction.createFolder(
					$FolderMenuState.folderId,
					$FolderMenuState.path,
					v
				)
					.then((res) => {
						console.log("create folder: ", res);
					})
					.catch((e) => {
						console.log(e);
					})
					.finally(() => {
						visible = false;
					});

				break;
			}
			case MenuOptionsFolder.createFile: {
				FolderStoreAction.createFile(
					$FolderMenuState.path,
					$FolderMenuState.folderId,
					v
				)
					.then((res) => {
						console.log("create file: ", res);
					})
					.catch((e) => {
						console.log(e);
					})
					.finally(() => {
						visible = false;
					});
				break;
			}
			case MenuOptionsFolder.renameFolder: {
				FolderStoreAction.renameFolder(
					$FolderMenuState.path,
					v,
					$FolderMenuState.folderId
				)
					.then((res) => {
						console.log("rename folder: ", res);
					})
					.catch((e) => {
						console.log(e);
					})
					.finally(() => {
						visible = false;
					});
				break;
			}
			case MenuOptionsFolder.deleteFolder: {
				FolderStoreAction.removeFolder(
					$FolderMenuState.path,
					$FolderMenuState.folderId
				)
					.then((res) => {
						console.log("remove folder: ", res);
					})
					.catch((e) => {
						console.log(e);
					})
					.finally(() => {
						visible = false;
					});
				break;
			}
		}
	};
</script>

<Menu
	{visible}
	bind:y={$FolderMenuState.y}
	on:outclick={() => {
		optionId = MenuOptionsFolder.nothing;
		handleOutClick();
	}}
>
	<OptionInput
		text="Create Folder"
		selected={optionId === MenuOptionsFolder.createFolder}
		handleInput={(v) => {
			if ($FolderMenuState.folders.includes(v)) {
				return [true, FolderNamingError.folderExist];
			}
			return validateFolderName(v);
		}}
		handleKeyDown={(_, v) => {
			if (v.length <= 0) {
				return [true, FolderNamingError.EmptyName];
			}
		}}
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
		on:click={() => (optionId = MenuOptionsFolder.createFolder)}
	/>
	<OptionInput
		text="Create File"
		selected={optionId === MenuOptionsFolder.createFile}
		handleInput={(v) => {
			if ($FolderMenuState.files.includes(v)) {
				return [true, FileNamingError.fileExist];
			}
			return validateFileName(v);
		}}
		handleKeyDown={(_, v) => {
			if (v.length <= 0) {
				return [true, FolderNamingError.EmptyName];
			}
		}}
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
		on:click={() => (optionId = MenuOptionsFolder.createFile)}
	/>
	<OptionMenu
		text="Delete Folder"
		on:click={async () => {
			optionId = MenuOptionsFolder.deleteFolder;
			let confirmed = await confirm("Are you sure?");
			if (confirmed) {
				handleOptionsSelected("null");
			}
		}}
	/>
	<OptionInput
		text="Rename Folder"
		selected={optionId === MenuOptionsFolder.renameFolder}
		handleInput={(v) => {
			if ($FolderMenuState.folders.includes(v)) {
				return [true, FolderNamingError.folderExist];
			}
			return validateFolderName(v);
		}}
		handleKeyDown={(_, v) => {
			if (v.length <= 0) {
				return [true, FolderNamingError.EmptyName];
			}
		}}
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
		on:click={() => (optionId = MenuOptionsFolder.renameFolder)}
	/>
</Menu>
