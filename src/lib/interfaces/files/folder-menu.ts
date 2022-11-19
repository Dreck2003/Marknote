export enum MenuFileOptions {
	nothing = "nothing",
	deleteFile = "delete-file",
	renameFile = "rename-file",
}

export enum MenuOptionsFolder {
	nothing = "nothing", // This option means that not selected
	createFolder = "create-folder",
	deleteFolder = "delete-folder",
	renameFolder = "rename-folder",
	createFile = "create-file",
}

export interface OptionMenuI {
	keydown: (e: KeyboardEvent) => any;
	handleKeyDown: any;
	dispatchClick: (...arg: any[]) => any;
	inputValue: string;
	optionId: MenuOptionsFolder;
	showInput: boolean;
	withInput: boolean;
	text: string;
}
