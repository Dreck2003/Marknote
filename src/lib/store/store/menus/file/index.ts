import { writable } from "svelte/store";

export interface FileMenuId {
	y: number;
	folderId: symbol;
	fileId: symbol;
	path: string;
	title: string;
}

export const FileMenuState = writable<FileMenuId>({
	y: 0,
	path: "",
	title: "",
	fileId: Symbol(""),
	folderId: Symbol(""),
});

// const getFolderMenuState=()=>{
//   let state:FolderMenuI;
//   const unsubscribe=FileMenuState.subscribe((v)=>state=v);
//   unsubscribe();
//   return state;
// }

export const FileMenuActions = {
	reset() {
		FileMenuState.update((state) => ({
			...state,
			y: 0,
			path: "",
			title: "",
		}));
	},
};
