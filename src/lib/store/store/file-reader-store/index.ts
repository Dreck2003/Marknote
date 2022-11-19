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

export const FileReaderActions = {
	getValue() {
		let data: FileReader;
		FileReaderStore.subscribe((f) => (data = f));
		return data;
	},
	reset() {
		FileReaderStore.set({
			isEmpty: true,
			content: "",
			folderId: Symbol(""),
			id: Symbol(""),
			name: "",
			path: "",
		});
	},
};
