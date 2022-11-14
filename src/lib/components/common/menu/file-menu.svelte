<script lang="ts">
	import { FolderStoreAction } from "../../../store/store";
	import { MenuFileOptions } from "../../../interfaces";
	import { FileMenuState } from "../../../store/store/menus";
	import Menu from "./principal/menu.svelte";
	import OptionInput from "./options/option-input.svelte";
	import Option from "./principal/option.svelte";
	import {
		FileNamingError,
		FolderNamingError,
		validateFileName,
	} from "../../../utils/errors/naming-errors";

	let optionId = MenuFileOptions.nothing;
	export let visible = false;
	export let handleOutClick = () => {};

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

<Menu
	{visible}
	bind:y={$FileMenuState.y}
	on:outclick={() => {
		optionId = MenuFileOptions.nothing;
		handleOutClick();
	}}
>
	<OptionInput
		text="Rename File"
		selected={optionId === MenuFileOptions.renameFile}
		handleInput={(v) => {
			if ($FileMenuState.files.includes(v)) {
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
		on:click={() => (optionId = MenuFileOptions.renameFile)}
	/>
	<Option
		on:click={async () => {
			optionId = MenuFileOptions.deleteFile;
			let confirmed = await confirm("Are you sure");
			if (confirmed) {
				handleOptionsSelected("null");
			}
		}}
		text="Delete File"
	/>
</Menu>
