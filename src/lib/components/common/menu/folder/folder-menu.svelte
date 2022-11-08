<script lang="ts">
	import { FolderStoreAction } from "../../../../store/store/folder-store";
	import { createFolder } from "../../../../utils/files/folder";
	import type { Writable } from "svelte/store";
	import { MenuOptionsFolder } from "../../../../interfaces/files/folder-menu";
	import OptionMenu from "./option-menu.svelte";
	export let folderMenu: Writable<{
		y: number;
		visible: boolean;
		folderId: symbol;
		path: string;
		title: string;
	}>;
	export let id = "";

	let inputValue = "";
	let optionId: MenuOptionsFolder = MenuOptionsFolder.nothing;
	$: optionId && (() => (inputValue = ""))();
	const resetStates = (visible: boolean) => {
		$folderMenu.visible = visible;
		inputValue = "";
		optionId = MenuOptionsFolder.nothing;
	};

	const dispatchEvent = (id: string) => {
		switch (id) {
			case MenuOptionsFolder.createFolder: {
				createFolder($folderMenu.path, inputValue)
					.then((path) => {
						return FolderStoreAction.createFolder($folderMenu.folderId, {
							id: Symbol(),
							path,
							title: inputValue,
							files: [],
							folders: [],
						});
					})
					.catch((e) => {
						alert(e);
						console.log("error: ", e);
					})
					.finally(() => {
						resetStates(false);
					});
				break;
			}
			case MenuOptionsFolder.deleteFolder: {
				FolderStoreAction.removeFolder($folderMenu.path, $folderMenu.folderId)
					.then(() => {
						console.log("Remove folder");
					})
					.catch((e) => {
						alert(e);
						console.log("error delete floder: ", e);
					})
					.finally(() => {
						resetStates(false);
					});

				break;
			}
			case MenuOptionsFolder.renameFolder: {
				console.log($folderMenu);
				console.log({ inputValue });
				FolderStoreAction.renameFolder(
					$folderMenu.path,
					inputValue,
					$folderMenu.folderId
				)
					.then((good: [boolean, string]) => {
						if (!good[0]) {
							throw new Error(good[1]);
						}
						$folderMenu = { ...$folderMenu, path: good[1], title: inputValue };
					})
					.catch((e) => {
						alert(e);
						console.log("error delete folder: ", e);
					})
					.finally(() => {
						resetStates(false);
					});

				break;
			}
			case MenuOptionsFolder.createFile:
				break;
		}
	};
	const handleKeyDown = (id: string) => (e: KeyboardEvent) => {
		if (e.key !== "Enter") return;
		dispatchEvent(id);
	};
</script>

{#if $folderMenu.visible}
	<div class="Custom_Menu flex" {id} style:top={$folderMenu.y + "px"}>
		<OptionMenu
			on:keydown
			{handleKeyDown}
			dispatchClick={() => {
				optionId = MenuOptionsFolder.createFolder;
			}}
			bind:inputValue
			bind:optionId
			showInput={optionId === MenuOptionsFolder.createFolder}
			withInput
			text={"Create folder"}
		/>
		<OptionMenu
			on:keydown
			{handleKeyDown}
			dispatchClick={() => {
				optionId = MenuOptionsFolder.createFile;
			}}
			bind:inputValue
			bind:optionId
			showInput={optionId === MenuOptionsFolder.createFile}
			withInput
			text={"Create file"}
		/>
		<OptionMenu
			on:keydown
			dispatchClick={() => {
				optionId = MenuOptionsFolder.deleteFolder;
				dispatchEvent(MenuOptionsFolder.deleteFolder);
			}}
			{handleKeyDown}
			bind:inputValue
			bind:optionId
			text={"Delete"}
		/>
		<OptionMenu
			on:keydown
			dispatchClick={() => {
				optionId = MenuOptionsFolder.renameFolder;
			}}
			{handleKeyDown}
			showInput={optionId === MenuOptionsFolder.renameFolder}
			bind:inputValue
			bind:optionId
			withInput
			text={"Rename"}
		/>
	</div>
{/if}

<style>
	.Custom_Menu {
		position: absolute;
		right: -1.3em;
		z-index: 99;
		background-color: rgb(90, 99, 153);
		border-radius: 4px;
		flex-direction: column;
		color: white;
		cursor: pointer;
	}
</style>
