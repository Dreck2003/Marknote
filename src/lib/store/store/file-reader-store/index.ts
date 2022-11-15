import { invoke } from "@tauri-apps/api/tauri";
import { InvokeHandler } from "../../../events/events";
import { writable } from "svelte/store";

export interface FileReader {
	name?: string;
	content?: string;
	path?: string;
	id?: symbol;
	isEmpty: boolean;
	folderId?: symbol;
}

const getFileValue = (): FileReader => {
	let data: FileReader;
	FileReaderStore.subscribe((f) => (data = f));
	return data;
};

/**
 * Its our File that is display in code editor
 */
export const FileReaderStore = writable<FileReader>({
	isEmpty: true,
});

// Our actions

export const FileReaderActions = {
	async convertMarkDown() {
		const value = getFileValue();
		// console.log("value: ", value);
		if (value.content) {
			const res = await invoke<string>(InvokeHandler.convertStrToMarkdown, {
				lines: value.content.split("\n"),
			});
			return res;
		}
		throw new Error("Not exist content");
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
