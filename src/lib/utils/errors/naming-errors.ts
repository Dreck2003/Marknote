export const enum FileNamingError {
	fileExist = "A file with the same name already exists.",
	emptyName = "You must provide a name for the file.",
	otherExtension = "The extension can only be  md",
	withoutExtension = "The extension '.md' missing.",
}

export enum FolderNamingError {
	folderExist = "A folder with the same name already exists.",
	EmptyName = "You must provide a name for the folder.",
	WithDot = "The Folder cannot have dot.",
}

type ExistError = boolean;

export const validateFolderName = (
	v: string
): [ExistError, FolderNamingError | ""] => {
	if (v.length <= 0) {
		return [true, FolderNamingError.EmptyName];
	}

	if (v.at(-1) === ".") {
		return [true, FolderNamingError.WithDot];
	}

	return [false, ""];
};

export const validateFileName = (
	v: string
): [ExistError, FileNamingError | ""] => {
	if (v.length <= 0) {
		return [true, FileNamingError.emptyName];
	}

	if (!v.includes(".")) {
		return [true, FileNamingError.withoutExtension];
	}
	const lastWord = v.split(".").pop();

	if (lastWord.length <= 0) {
		return [true, FileNamingError.withoutExtension];
	}

	if (lastWord.length > 0 && lastWord !== "md") {
		return [true, FileNamingError.otherExtension];
	}
	return [false, ""];
};
