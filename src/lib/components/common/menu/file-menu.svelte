<script lang="ts">
	import FolderFileMenu from "./menu.svelte";
	import OptionMenu from "./common/option-menu.svelte";
	import { FileMenuState } from "../../../store/store/menus/file";
	import { MenuFileOptions } from "../../../interfaces/files/folder-menu";
	import { FolderStoreAction } from "../../../store/store/folder-store";

	export let visible = false;
	let optionId = MenuFileOptions.nothing;

	const handleOptionsSelected = (v: string) => {
		switch (optionId) {
			case MenuFileOptions.renameFile: {
				FolderStoreAction.renameFile(
					$FileMenuState.path,
					v,
					$FileMenuState.folderId,
					$FileMenuState.fileId
				)
					.then((res) => {
						console.log("rename file: ", res);
					})
					.catch((e) => {
						console.log(e);
					})
					.finally(() => {
						visible = false;
					});

				break;
			}
			case MenuFileOptions.deleteFile: {
				FolderStoreAction.removeFile(
					$FileMenuState.path,
					$FileMenuState.folderId,
					$FileMenuState.fileId
				)
					.then((res) => {
						console.log("remove file: ", res);
					})
					.catch((e) => console.log(e))
					.finally(() => {
						visible = false;
					});
				console.log("delete file");
				break;
			}
		}
	};
</script>

<FolderFileMenu {visible} bind:y={$FileMenuState.y} on:outclick>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuFileOptions.renameFile;
		}}
		showInput={optionId === MenuFileOptions.renameFile}
		text={"Rename File"}
		on:selectInput={(e) => {
			handleOptionsSelected(e.detail.value);
		}}
		withInput
	/>
	<OptionMenu
		handleKeyDown={() => () => {}}
		dispatchClick={() => {
			optionId = MenuFileOptions.deleteFile;
			handleOptionsSelected("null");
		}}
		text={"Delete File"}
	/>
</FolderFileMenu>
