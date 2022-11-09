<script lang="ts">
	import FolderFileMenu from "./menu.svelte";
	import OptionMenu from "./common/option-menu.svelte";
	import { FolderMenuState } from "../../../store/store/menus/folder/index";
	import { MenuOptionsFolder } from "../../../interfaces/files/folder-menu";
	import { FolderStoreAction } from "../../../store/store/";

	export let visible = false;
	let optionId = MenuOptionsFolder.nothing;

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

<FolderFileMenu {visible} bind:y={$FolderMenuState.y} on:outclick>
	<OptionMenu
		dispatchClick={() => {
			optionId = MenuOptionsFolder.createFolder;
		}}
		showInput={optionId === MenuOptionsFolder.createFolder}
		text={"Create Folder"}
		withInput
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuOptionsFolder.createFile;
		}}
		showInput={optionId === MenuOptionsFolder.createFile}
		text={"Create File"}
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
		withInput
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuOptionsFolder.deleteFolder;
			handleOptionsSelected("null");
		}}
		text={"Delete Folder"}
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuOptionsFolder.renameFolder;
		}}
		showInput={optionId === MenuOptionsFolder.renameFolder}
		text={"Rename Folder"}
		on:selectInput={(e) => handleOptionsSelected(e.detail.value)}
		withInput
	/>
</FolderFileMenu>
