import { writable } from "svelte/store";

export interface FileReader {
	name?: string;
	content?: string;
	isEmpty: boolean;
}

export const FileReaderStore = writable<FileReader>({
	isEmpty: true,
});
