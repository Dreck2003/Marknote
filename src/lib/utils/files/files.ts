import { BaseDirectory, readDir, readTextFile } from "@tauri-apps/api/fs";
import type { FolderContent, FileEntry } from "src/lib/interfaces/files/files";

export const readDirectoryRecursive = async (
	path: string
): Promise<FolderContent> => {
	const data = await readDir(path, {
		dir: BaseDirectory.Desktop,
		recursive: true,
	});

	const fileContent: FolderContent = { files: [], folders: [] };
	return await recursiveReadFolder(data, fileContent);
};

export const readFile = async (path: string): Promise<string> =>
	await readTextFile(path);

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
				});
				currentFolder.folders.push(newFolder);
			} catch (error) {
				// console.log("error: ", { error });
			}
			return;
		}
		try {
			const content = await readFile(entry.path);
			currentFolder.files.push({ name: entry.name, content });
		} catch (error) {
			// console.log("error file: ", { error });
		}
	});

	return currentFolder;
};
