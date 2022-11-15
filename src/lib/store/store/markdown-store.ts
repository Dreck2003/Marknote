import { invoke } from "@tauri-apps/api";
import { InvokeHandler } from "../../events/events";
import { writable } from "svelte/store";
import { FileReaderActions } from "./file-reader-store";

interface MarkdownStoreI {
	visible: boolean;
	content: string;
}

export const MarkdownStore = writable<MarkdownStoreI>({
	visible: false,
	content: "",
});

export const MarkdownStoreActions = {
	getStore() {
		let data: MarkdownStoreI;
		MarkdownStore.subscribe((d) => (data = d));
		return data;
	},
	async convertMarkDown() {
		const value = FileReaderActions.getValue();
		if (value.content === undefined || value.content === null) {
			throw new Error("Not exist content");
		}

		if (value.content.length === 0) {
			return MarkdownStore.update((mark) => ({ ...mark, content: "" }));
		}

		if (value.content.length > 0) {
			const content = await invoke<string>(InvokeHandler.convertStrToMarkdown, {
				lines: value.content.split("\n"),
			});
			return MarkdownStore.update((mark) => ({ ...mark, content }));
		}
	},
	reset() {
		MarkdownStore.set({
			content: "",
			visible: false,
		});
	},
};
