export interface FileEntry {
	children?: FileEntry[];
	path: string;
	name?: string;
}

export interface FileContent {
	name?: string;
	content: string;
	path: string;
	id: symbol;
}

export interface FolderContent {
	files?: FileContent[];
	folders?: FolderContent[];
	path: string;
	title: string;
	id: symbol;
}
