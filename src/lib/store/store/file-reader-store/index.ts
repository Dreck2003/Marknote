import { writable } from "svelte/store";

export interface FileReader {
	name?: string;
	content?: string;
	path?: string;
	id?: symbol;
	isEmpty: boolean;
	folderId?: symbol;
}

/**
 * Its our File that is display in code editor
 */
export const FileReaderStore = writable<FileReader>({
	isEmpty: true,
});

// Our actions
