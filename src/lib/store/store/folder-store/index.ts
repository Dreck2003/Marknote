import { sep } from "@tauri-apps/api/path";
import { createNewFolder, removeFolder } from "./../../../utils/files/folder";
import { newFolder } from "./../../../utils/files/files";
import { OpenFolderEvent } from "../../../events/folder-events";
import type { FolderContent } from "../../../interfaces/files/files";
import { writable } from "svelte/store";
import { invoke } from "@tauri-apps/api";
import { InvokeHandler } from "../../../events/events";

/**
 * Its our folderStore, where save our folder tree
 */
export const FolderStore = writable<FolderContent>({
	files: [],
	folders: [],
	path: "",
	title: "Empty Title",
	id: Symbol("Empty Title"),
});

// Our actions
const getValueOfFolderStore = (): FolderContent => {
	let folderStore: FolderContent;
	const unsubscribe = FolderStore.subscribe((v) => {
		folderStore = v;
	});
	unsubscribe();
	return folderStore;
};

export const FolderStoreAction = {
	async OpenFolder() {
		const folderTree = await OpenFolderEvent();
		FolderStore.set(folderTree);
	},
	saveFile(folderId: symbol, fileId: symbol, content: string) {
		const newFolderTree = newFolder(
			folderId,
			fileId,
			content,
			getValueOfFolderStore()
		);
		FolderStore.set(newFolderTree);
	},
	async createFolder(folderId: symbol, newFolder: FolderContent) {
		const folderTree = getValueOfFolderStore();
		const folder = await createNewFolder(
			folderId,
			folderTree,
			async (folder) => {
				return { ...folder, folders: folder.folders.concat(newFolder) };
			}
		);
		FolderStore.set(folder);
	},
	async removeFolder(path: string, folderId: symbol) {
		const folderTree = getValueOfFolderStore();
		await removeFolder(path);
		const folder = await createNewFolder(folderId, folderTree, () => null);
		FolderStore.set(folder);
	},
	async renameFolder(path: string, newName: string, folderId: symbol) {
		const splitPath = path.split(sep);
		splitPath.pop();
		const newPath = splitPath.concat(newName).join(sep);
		const result = await invoke<[boolean, string]>(
			InvokeHandler.renameFileOrFolder,
			{
				path,
				newPath,
			}
		);
		if (!result[0]) {
			return result.slice();
		}
		const folderTree = getValueOfFolderStore();
		const folder = await createNewFolder(folderId, folderTree, async (f) => ({
			...f,
			title: newName,
			path: newPath,
		}));
		FolderStore.set(folder);
		return result.slice();
	},
};
