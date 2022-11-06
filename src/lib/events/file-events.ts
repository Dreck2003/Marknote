import { open } from "@tauri-apps/api/dialog";
import { desktopDir } from "@tauri-apps/api/path";
import type { FolderContent } from "../interfaces/files/files";
import { readDirectoryRecursive } from "../utils/files/files";

export const OpenFolderEvent = async (): Promise<FolderContent> => {
	const directory = await open({
		defaultPath: await desktopDir(),
		directory: true,
		title: "Select Folder",
		filters: [{ name: "", extensions: ["md"] }],
		recursive: true,
	});
	if (Array.isArray(directory)) {
		return { files: [], folders: [], title: "", path: "", id: Symbol(null) };
	}
	return await readDirectoryRecursive(directory);
};
