import type { FolderContent } from "src/lib/interfaces/files/files";
import { writable } from "svelte/store";

export interface FileReader {
	name?: string;
	content?: string;
	path?: string;
	id?: symbol;
	isEmpty: boolean;
	folderId?: symbol;
}

export const FileReaderStore = writable<FileReader>({
	isEmpty: true,
});

export const FolderStore = writable<FolderContent>({
	files: [],
	folders: [],
	path: "",
	title: "Empty Title",
	id: Symbol("Empty Title"),
});
