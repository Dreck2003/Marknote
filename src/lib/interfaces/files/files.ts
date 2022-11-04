export interface FileEntry {
	path: string;
	name?: string;
	children?: FileEntry[];
}

export interface FileContent {
	name?: string;
	content: string;
}

export interface FolderContent {
	files?: FileContent[];
	folders?: FolderContent[];
}
