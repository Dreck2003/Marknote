import type { FileContent } from "./../../../../interfaces/files/files";
import { writable } from "svelte/store";

export interface FileMenuId {
	y: number;
	folderId: symbol;
	fileId?: symbol;
	path: string;
	files: string[];
	title: string;
}

export interface FileMenuProps {
	id: symbol;
	path: string;
	name: string;
	files: string[];
}

export const getFileDataForMenu = (
	file: FileContent,
	files: string[]
): FileMenuProps => {
	return {
		files,
		id: file.id,
		name: file.name,
		path: file.path,
	};
};

export const FileMenuState = writable<FileMenuId>({
	y: 0,
	path: "",
	title: "",
	files: [],
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
			folderId: Symbol(""),
			y: 0,
			path: "",
			files: [],
			title: "",
		}));
	},
};
