import { writable } from "svelte/store";

export interface FolderMenuI {
	y: number;
	folderId?: symbol;
	path: string;
	title: string;
}

export const FolderMenuState = writable<FolderMenuI>({
	y: 0,
	path: "",
	title: "",
});

// const getFolderMenuState=()=>{
//   let state:FolderMenuI;
//   const unsubscribe=FolderMenuState.subscribe((v)=>state=v);
//   unsubscribe();
//   return state;
// }

export const FolderMenuActions = {
	reset() {
		FolderMenuState.update((state) => ({
			y: 0,
			path: "",
			title: "",
		}));
	},
};
