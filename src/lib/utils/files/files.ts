import {
	BaseDirectory,
	readDir,
	readTextFile,
	writeTextFile,
} from "@tauri-apps/api/fs";
import { basename } from "@tauri-apps/api/path";
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
	return await recursiveReadFolder(data, fileContent);
};

export const recursiveReadFolder = async (
	entries: FileEntry[],
	currentFolder: FolderContent
): Promise<FolderContent> => {
	// eslint-disable-next-line @typescript-eslint/no-misused-promises
	entries.forEach(async (entry) => {
		if (entry.children && Array.isArray(entry.children)) {
			try {
				const newFolder = await recursiveReadFolder(entry.children, {
					files: [],
					folders: [],
					path: entry.path,
					title: entry.name ?? "name-less",
					id: Symbol(entry.name),
				});
				currentFolder.folders.push(newFolder);
			} catch (error) {
				// console.log("error: ", { error });
			}
			return;
		}
		try {
			const content = await readTextFile(entry.path);
			currentFolder.files.push({
				name: entry.name,
				content,
				path: entry.path,
				id: Symbol(entry.name),
			});
		} catch (error) {
			// console.log("error file: ", { error });
		}
	});

	return currentFolder;
};

export const saveFile = async (path: string, content: string): Promise<any> => {
	const res = await writeTextFile(path, content);
	return res;
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
