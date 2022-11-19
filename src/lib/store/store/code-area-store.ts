import { writable } from "svelte/store";

interface CodeAreaStoreI {
	saved: boolean;
	content: string;
}

export const CodeAreaStore = writable<CodeAreaStoreI>({
	saved: true,
	content: "",
});
