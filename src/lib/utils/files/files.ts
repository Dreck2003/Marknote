import {
	BaseDirectory,
	readDir,
	readTextFile,
	writeTextFile,
	removeDir,
	createDir,
} from "@tauri-apps/api/fs";
import { basename, sep } from "@tauri-apps/api/path";
import type { FolderContent, FileEntry } from "../../interfaces/files/files";

export const readDirectoryRecursive = async (
	path: string
): Promise<FolderContent> => {
	const data = await readDir(path, {
		dir: BaseDirectory.Desktop,
		recursive: true,
	});
	const initName = await basename(path);
	const fileContent: FolderContent = {
		files: [],
		folders: [],
		path,
		title: initName,
		id: Symbol(null),
	};
	const folder = await recursiveReadFolder(data, fileContent);
	return folder;
};

export const recursiveReadFolder = async (
	entries: FileEntry[],
	currentFolder: FolderContent
): Promise<FolderContent> => {
	const folders: FileEntry[] = [];
	const files: FileEntry[] = [];

	entries.forEach((entry) => {
		if (entry.children && Array.isArray(entry.children)) {
			return folders.push(entry);
		}
		if (entry.name && entry.name.split(".").pop() === "md") {
			files.push(entry);
		}
	});

	const filesPromise = await Promise.all(
		files.map(async (entry: FileEntry) => {
			const content = await readTextFile(entry.path);
			return {
				name: entry.name,
				content,
				path: entry.path,
				id: Symbol(entry.name),
			};
		})
	);

	const folderPromise = await Promise.all(
		folders.map(async (entry: FileEntry) => {
			return await recursiveReadFolder(entry.children, {
				files: [],
				folders: [],
				path: entry.path,
				title: entry.name ?? "name-less",
				id: Symbol(entry.name),
			});
		})
	);

	return { ...currentFolder, files: filesPromise, folders: folderPromise };
};

export const newFolder = (
	folderId: symbol,
	fileId: symbol,
	content: string,
	folderDir: FolderContent
): FolderContent | null => {
	if (folderDir.id === folderId) {
		const files = folderDir.files.map((file) => {
			return file.id === fileId ? { ...file, content } : { ...file };
		});
		return { ...folderDir, files };
	}
	const folders = folderDir.folders.map((folder) => {
		return newFolder(folderId, fileId, content, folder);
	});

	return { ...folderDir, folders };
};

export const removeFolder = async (path: string): Promise<any> => {
	await removeDir(path);
};

export const createFolder = async (
	path: string,
	name: string
): Promise<any> => {
	// const pathFolderComplete = path + sep + name;
	// await createDir("",{recursive:true});
};

// Files functions:

export const saveFile = async (path: string, content: string): Promise<any> => {
	const res = await writeTextFile(path, content);
	return res;
};

export const renameFile = async (
	path: string,
	newName: string
): Promise<void> => {
	// const filePath = path.split(sep);
	// const fileName = filePath.pop();
	// console.log({ filePath: filePath.join(sep), newName, fileName });
	// await renameSingleFile(path,newPath);
};
