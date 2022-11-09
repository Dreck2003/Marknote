<script lang="ts">
	import FolderFileMenu from "./menu.svelte";
	import OptionMenu from "./folder/option-menu.svelte";
	import { FileMenuState } from "../../../store/store/menus/file";
	import { MenuFileOptions } from "../../../interfaces/files/folder-menu";

	export let visible = false;
	let optionId = MenuFileOptions.nothing;
</script>

<FolderFileMenu {visible} bind:y={$FileMenuState.y} on:outclick>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuFileOptions.createFile;
		}}
		showInput={optionId === MenuFileOptions.createFile}
		text={"Create File"}
		withInput
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuFileOptions.renameFile;
		}}
		showInput={optionId === MenuFileOptions.renameFile}
		text={"Rename File"}
		withInput
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuFileOptions.deleteFile;
		}}
		text={"Delete File"}
	/>
</FolderFileMenu>
