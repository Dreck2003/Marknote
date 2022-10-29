export const Arrays = {
	for<T>(list: T[], callback: (value: T, i: number) => boolean): void {
		for (let i = 0; i < list.length; i++) {
			if (callback(list[i], i)) return;
		}
	},
	loop(num: number, callback: (num: number) => void): void {
		for (let i = 0; i < num; i++) {
			callback(i);
		}
	},
};

export const getWords = (text: string): string[] => {
	let word = "";
	const completeWords: string[] = [];
	const length = text.length;
	for (let i = 0; i < length; i += 1) {
		const letter = text[i];
		if (letter !== " ") {
			word += text[i];
		}
		if (letter === " ") {
			completeWords.push(word);
			completeWords.push(" ");
			word = "";
			continue;
		}
	}
	completeWords.push(word);
	return completeWords;
};
