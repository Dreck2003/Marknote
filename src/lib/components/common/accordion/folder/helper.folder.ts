interface FileContent {
	name: string;
	content: string;
}

export interface FolderContent {
	title: string;
	files: FileContent[];
	folders: FolderContent[];
}
