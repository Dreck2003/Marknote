import type { FolderContent } from "./../../../../interfaces/files/files";
import { writable } from "svelte/store";

export interface FolderMenuI {
	y: number;
	folderId?: symbol;
	path: string;
	title: string;
	folders: string[];
	files: string[];
	parentFolders: string[];
}

export interface FolderMenuProps {
	id: symbol;
	path: string;
	title: string;
	files: string[];
	folders: string[];
	parentFolders: string[];
}

export const getFolderDataForMenu = (
	f: FolderContent,
	parentFolders: string[]
): FolderMenuProps => {
	return {
		parentFolders,
		id: f.id,
		path: f.path,
		title: f.title,
		files: f.files.map(({ name }) => name),
		folders: f.folders.map(({ title }) => title),
	};
};

export const FolderMenuState = writable<FolderMenuI>({
	y: 0,
	path: "",
	folders: [],
	files: [],
	parentFolders: [],
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
			folders: [],
			files: [],
			parentFolders: [],
			path: "",
			title: "",
		}));
	},
};
