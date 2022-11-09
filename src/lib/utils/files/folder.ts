import type { FolderContent } from "./../../interfaces/files/files";
import { sep } from "@tauri-apps/api/path";
import { createDir, removeDir } from "@tauri-apps/api/fs";

export const createFolder = async (
	path: string,
	name: string
): Promise<string> => {
	const pathFolderComplete = path + sep + name;
	await createDir(pathFolderComplete, { recursive: true });
	return pathFolderComplete;
};

export const renovateFolder = async (
	folderId: symbol,
	oldFolder: FolderContent,
	cb: (oldFolder: FolderContent) => FolderContent
): Promise<any> => {
	let searching = true;
	let folders: FolderContent[] = [];
	const accFolders: FolderContent[][] = [];

	let newFolders = [];

	while (searching) {
		// traverse the array:
		const acumulateFolders: FolderContent[] = [];

		for (let i = 0; i < folders.length; i += 1) {
			const folder = folders[i];
			if (folder.id === folderId) {
				acumulateFolders.push(cb(folder)); // Push the new
				searching = false;
				continue;
			}
			acumulateFolders.push(folder);
		}

		if (!searching) {
			// Is encountered folder
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			newFolders = acumulateFolders;
			break;
		}

		accFolders.push(acumulateFolders);
		if (accFolders.length <= 0) {
			searching = false;
			break;
		}

		folders = accFolders.shift();
	}
};

type TCreateNewFolder = (
	oldFolder: FolderContent
) => Promise<FolderContent | null>;

export const createNewFolder = async (
	folderId: symbol,
	folderDir: FolderContent,
	cb: TCreateNewFolder
): Promise<FolderContent | null> => {
	if (folderDir.id === folderId) {
		return await cb(folderDir);
	}
	const folders = await Promise.all(
		folderDir.folders.map(async (folder) => {
			return await createNewFolder(folderId, folder, cb);
		})
	);

	return { ...folderDir, folders: folders.filter((f) => f) };
};

export const removeFolder = async (path: string): Promise<void> => {
	await removeDir(path, { recursive: true });
};
