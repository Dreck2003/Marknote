<script lang="ts">
	import FolderFileMenu from "./menu.svelte";
	import OptionMenu from "./common/option-menu.svelte";
	import { FolderMenuState } from "../../../store/store/menus/folder/index";
	import { MenuOptionsFolder } from "../../../interfaces/files/folder-menu";

	export let visible = false;
	let optionId = MenuOptionsFolder.nothing;
</script>

<FolderFileMenu {visible} bind:y={$FolderMenuState.y} on:outclick>
	<OptionMenu
		dispatchClick={() => {
			optionId = MenuOptionsFolder.createFolder;
		}}
		showInput={optionId === MenuOptionsFolder.createFolder}
		text={"Create Folder"}
		withInput
		on:selectInput={(e) => {}}
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuOptionsFolder.createFile;
		}}
		showInput={optionId === MenuOptionsFolder.createFile}
		text={"Create File"}
		withInput
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuOptionsFolder.deleteFolder;
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
		withInput
	/>
</FolderFileMenu>
