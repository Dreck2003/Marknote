import { sep } from "@tauri-apps/api/path";
import { createNewFolder, removeFolder } from "./../../../utils/files/folder";
import {
	createFile,
	newFolder,
	removeFile,
} from "./../../../utils/files/files";
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
			files: f.files,
			folders: f.folders,
			title: newName,
			path: newPath,
			id: Symbol(newName),
		}));
		FolderStore.set(folder);
		return result.slice();
	},
	async removeFile(path: string, folderId: symbol, fileId: symbol) {
		const folderTree = getValueOfFolderStore();
		await removeFile(path);
		const folder = await createNewFolder(folderId, folderTree, async (f) => {
			return {
				id: f.id,
				folders: f.folders,
				files: f.files.filter(({ id }) => id !== fileId),
				path: f.path,
				title: f.title,
			};
		});
		FolderStore.set(folder);
	},
	async renameFile(
		path: string,
		newName: string,
		folderId: symbol,
		fileId: symbol
	) {
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
			id: f.id,
			files: f.files.map((file) => {
				return file.id === fileId
					? { ...file, id: Symbol(newName), name: newName, path: newPath }
					: { ...file };
			}),
			folders: f.folders,
			title: f.title,
			path: f.path,
		}));
		FolderStore.set(folder);
		return result.slice();
	},
	async createFile(pathFolder: string, folderId: symbol, fileName: string) {
		const newPath = pathFolder + sep + fileName + ".md";
		await createFile(newPath);
		const folderTree = await createNewFolder(
			folderId,
			getValueOfFolderStore(),
			async (f) => {
				return {
					...f,
					files: f.files.concat({
						content: "",
						id: Symbol(""),
						path: newPath,
						name: fileName,
					}),
				};
			}
		);
		FolderStore.set(folderTree);
		return true;
	},
};
