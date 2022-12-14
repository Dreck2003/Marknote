import { sep } from "@tauri-apps/api/path";
import {
	createFolder,
	createNewFolder,
	removeFolder,
} from "./../../../utils/files/folder";
import {
	createFile,
	newFolder,
	readDirectoryRecursive,
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
		const result = await OpenFolderEvent();
		FolderStore.set(result[0]);
		return result[1];
	},
	async readFolderCache(url: string) {
		const folderTree = await readDirectoryRecursive(url);
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
	async createFolder(folderId: symbol, path: string, name: string) {
		const folderTree = getValueOfFolderStore();
		const createPath = await createFolder(path, name);
		const folder = await createNewFolder(
			folderId,
			folderTree,
			async (folder) => {
				return {
					...folder,
					folders: folder.folders.concat({
						id: Symbol(name),
						title: name,
						files: [],
						folders: [],
						path: createPath,
					}),
				};
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
			throw new Error(result[1]);
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
		return result[1];
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
