<script lang="ts">
	import FolderFileMenu from "./menu.svelte";
	import OptionMenu from "./common/option-menu.svelte";
	import { FileMenuState } from "../../../store/store/menus/file";
	import { MenuFileOptions } from "../../../interfaces/files/folder-menu";
	import { FolderStoreAction } from "../../../store/store/folder-store";
	import {
		FileNamingError,
		validateFileName,
	} from "../../../utils/errors/naming-errors";

	export let visible = false;
	export let handleOutClick = () => {};
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

<FolderFileMenu
	{visible}
	bind:y={$FileMenuState.y}
	on:outclick={() => {
		optionId = MenuFileOptions.nothing;
		handleOutClick();
	}}
>
	<OptionMenu
		handleKeyDown={(_, v) => {
			if (v.length <= 0) {
				return [true, FileNamingError.emptyName];
			}
		}}
		dispatchClick={() => {
			optionId = MenuFileOptions.renameFile;
		}}
		showInput={optionId === MenuFileOptions.renameFile}
		text={"Rename File"}
		on:selectInput={(e) => {
			handleOptionsSelected(e.detail.value);
		}}
		handleInput={(v) => {
			if ($FileMenuState.files.includes(v)) {
				return [true, FileNamingError.fileExist];
			}

			return validateFileName(v);
		}}
		withInput
	/>
	<OptionMenu
		dispatchClick={async () => {
			optionId = MenuFileOptions.deleteFile;
			let confirmed = await confirm("Are you sure");
			if (confirmed) {
				handleOptionsSelected("null");
			}
		}}
		text={"Delete File"}
	/>
</FolderFileMenu>
