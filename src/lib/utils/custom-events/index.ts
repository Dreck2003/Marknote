interface CustomTraitEvent {
	destroy: () => void;
}

export const clickOutside = (node: HTMLElement): CustomTraitEvent => {
	const handleClick = (e: MouseEvent): any => {
		if (!node.contains(e.target as Node)) {
			node.dispatchEvent(new CustomEvent("outclick"));
		}
	};

	document.addEventListener("click", handleClick);

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true);
		},
	};
};
