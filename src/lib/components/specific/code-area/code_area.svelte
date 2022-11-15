<script lang="ts">
	import { Arrays } from "../../../utils/arrays/Arrays";
	import { KeyboardKeys } from "../../../interfaces/keyboard/keyboard";
	import Cursor from "../../common/coder/cursor.svelte";
	import SingleLine from "../../common/coder/single_line.svelte";
	import { ContextCodeArea } from "../../../utils/code_area_util";
	import { InputType } from "../../../interfaces/inputs";
	import { createEventDispatcher, onMount } from "svelte";
	export let value = "";
	let textCode: HTMLTextAreaElement | null = null;
	type selectType = {
		start: { init: number; y: number };
		end: { init: number; y: number };
	};
	let codeArea: HTMLElement | null = null;
	let codeLines: HTMLElement | null = null;
	let position = { x: 0, y: 0 };
	let arrowPos = 0;
	let selectionState = { start: { init: 0, y: 0 }, end: { init: 0, y: 0 } };
	let changeManualSelection = false;
	let isInitialClick = false;
	let selectionWithMouse = {
		isMouseDown: false,
		isMouseMove: false,
		isMouseUp: false,
	};
	let codeChildren = [];
	let selectedChildren: HTMLElement[] = [];

	const fixedNumber = (n: number, size: number): number => {
		const number = Number(n.toFixed(size));
		return number === 0 ? 0 : number;
	};

	const dispatcher = createEventDispatcher();

	const getLeftDistance = () => {
		return (codeArea?.offsetLeft || 0) + (codeLines?.offsetLeft || 0);
	};
	const getPositionInText = (pageX: number, pageY: number) => {
		const x = pageX - getLeftDistance();
		let XPosition = fixedNumber(x / 8.8, 0);
		let YPosition = Math.floor(pageY / 22);
		if (YPosition >= textSplit.length) YPosition = textSplit.length - 1;
		YPosition = YPosition <= 0 ? 0 : YPosition;
		let currentLineLength = textSplit[YPosition].length;
		if (XPosition >= currentLineLength) XPosition = currentLineLength;
		return { XPosition: XPosition <= 0 ? 0 : XPosition, YPosition };
	};

	$: textSplit = value.split("\n");
	const resetStyles = (el: HTMLElement) => {
		if (el instanceof HTMLElement) {
			el.style.left = "0px";
			el.style.width = "0px";
		}
	};
	const resetStylesInElements = () => {
		selectedChildren.forEach(resetStyles);
		selectedChildren = [];
	};
	const searchSelection = ({
		selectionStart,
		selectionEnd,
	}: {
		selectionStart: number;
		selectionEnd: number;
	}) => {
		const start = { init: 0, i: 0, selected: false };
		const end = { init: 0, i: 0, selected: false };
		Arrays.for(textSplit, (line, i) => {
			let length = line.length;
			if (start.selected && end.selected) return true;
			if (!start.selected) {
				start.i = i;
				if (start.init + length >= selectionStart) {
					start.selected = true;
				} else {
					start.init += length + 1;
				}
			}
			if (!end.selected) {
				end.i = i;
				if (end.init + length >= selectionEnd) {
					end.selected = true;
				} else {
					end.init += length + 1;
				}
			}
			return false;
		});
		return { start: { ...start }, end: { ...end } };
	};

	const handleKeydown = (e: KeyboardEvent) => {
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart, selectionEnd, selectionDirection } = textarea;
		let y = Number((position.y / 22).toFixed(1));
		let currentLine = textSplit[y] || "";
		let lineLength = currentLine.length;
		let positionX = fixedNumber(position.x / 8.8, 1);
		let withShift = e.shiftKey;

		if (e.key === "s" && e.ctrlKey && !e.shiftKey) {
			dispatcher("save", {
				content: value,
			});
			e.preventDefault();
			return;
		}

		if (e.key === KeyboardKeys.ArrowDown && !withShift) {
			if (selectionStart !== selectionEnd) {
				e.preventDefault();
				resetStylesInElements();
				changeManualSelection = true;
				if (selectionState.end.y >= textSplit.length - 1) {
					let lineCurrent = textSplit.at(-1).length;
					textarea.setSelectionRange(
						selectionEnd + (lineCurrent - selectionState.end.init),
						selectionEnd + (lineCurrent - selectionState.end.init)
					);
					arrowPos = textSplit.at(-1).length;
					position.x = arrowPos * 8.8;
					position.y = (textSplit.length - 1) * 22;
					return;
				}
				let lineCurrent = textSplit[selectionState.end.y].length;
				let nextLine = textSplit[selectionState.end.y + 1].length;
				let rest =
					nextLine <= selectionState.end.init
						? nextLine
						: selectionState.end.init;
				textarea.setSelectionRange(
					selectionEnd + rest + 1 + (lineCurrent - selectionState.end.init),
					selectionEnd + rest + 1 + (lineCurrent - selectionState.end.init)
				);
				arrowPos = rest;
				position.x = rest * 8.8;
				position.y = (selectionState.end.y + 1) * 22;
				return;
			}
			if (y + 1 === textSplit.length) {
				return (position.x = currentLine.length * 8.8);
			}
			if (y + 1 > textSplit.length) return;
			let nextLine = textSplit[y + 1];
			if (nextLine.length < arrowPos) {
				position.x = nextLine.length * 8.8;
				position.y = position.y + 22;
				return;
			}
			position.x = arrowPos * 8.8;
			position.y = position.y + ContextCodeArea.style.height;
			return;
		}
		if (e.key === KeyboardKeys.ArrowUp && !withShift) {
			if (selectionStart !== selectionEnd) {
				e.preventDefault();
				resetStylesInElements();
				changeManualSelection = true;
				if (selectionState.start.y === 0) {
					position.x = 0;
					arrowPos = 0;
					return textarea.setSelectionRange(0, 0);
				}
				let linePrev = textSplit[selectionState.start.y - 1].length;
				let maxSize =
					linePrev <= selectionState.start.init
						? linePrev
						: selectionState.start.init;
				position.x = maxSize * 8.8;
				position.y = (selectionState.start.y - 1) * 22;
				let rest =
					selectionStart - selectionState.start.init - (linePrev - maxSize);
				arrowPos = maxSize;
				textarea.setSelectionRange(rest - 1, rest - 1);
				return;
			}
			if (y <= 0 && positionX === 0) return;
			if (y === 0) {
				return (position = {
					x: 0,
					y: 0,
				});
			}
			const oldLine = textSplit[y - 1];
			if (arrowPos > oldLine.length) {
				return (position = {
					x: oldLine.length * 8.8,
					y: position.y - 22,
				});
			}
			position.x = arrowPos * 8.8;
			position.y = position.y - ContextCodeArea.style.height;
			return;
		}
		if (e.key === KeyboardKeys.ArrowRight && !withShift && !e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
				arrowPos = selectionState.end.init;
				return (position = {
					x: selectionState.end.init * 8.8,
					y: selectionState.end.y * 22,
				});
			}
			if (positionX + 1 > lineLength && y + 1 >= textSplit.length) return;
			if (positionX + 1 > lineLength && y + 1 < textSplit.length) {
				position = {
					x: 0,
					y: position.y + ContextCodeArea.style.height,
				};
				arrowPos = 0;
				return;
			}
			position.x = position.x + 8.8;
			arrowPos += 1;
			return;
		}
		if (e.key === KeyboardKeys.ArrowRight && e.ctrlKey && !withShift) {
			if (selectionStart !== selectionEnd) return;
			if (positionX === currentLine.length && y === textSplit.length - 1)
				return;
			changeManualSelection = true;
			if (positionX === currentLine.length) {
				textCode.setSelectionRange(selectionStart + 1, selectionEnd + 1);
				return (position = {
					x: 0,
					y: position.y + 22,
				});
			}
			let splitLine = currentLine.split(" ");
			let reducer = 0;
			for (let i = 0; i < splitLine.length; i++) {
				const wordSize = splitLine[i].length;
				const plus = i === 0 ? 0 : 1;
				reducer += wordSize + plus;
				if (reducer > positionX) {
					break;
				}
			}
			textCode.setSelectionRange(
				selectionStart + (reducer - positionX),
				selectionEnd + (reducer - positionX)
			);
			position.x = reducer * 8.8;
			return;
		}
		if (e.key === KeyboardKeys.ArrowRight && withShift && !e.ctrlKey) {
			if (selectionEnd - selectionStart === 1) {
				position.x = position.x + 8.8;
				resetStylesInElements();
			}
			return;
		}
		if (e.key === KeyboardKeys.ArrowLeft && !withShift && !e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
				arrowPos = selectionState.start.init;
				return (position = {
					x: selectionState.start.init * 8.8,
					y: selectionState.start.y * 22,
				});
			}
			if (positionX == 0 && y === 0) return;
			if (positionX == 0 && y > 0) {
				let oldLine = textSplit[y - 1];
				position.x = oldLine.length * 8.8;
				position.y = position.y - ContextCodeArea.style.height;
				arrowPos = oldLine.length;
				return;
			}
			position.x = position.x - 8.8;
			arrowPos -= 1;
			return;
		}

		if (e.key === KeyboardKeys.ArrowLeft && e.ctrlKey && !withShift) {
			if (selectionStart !== selectionEnd) return;
			if (position.x === 0 && position.y === 0) return;
			changeManualSelection = true;
			if (position.x === 0) {
				let oldLine = textSplit[y - 1];
				textCode.setSelectionRange(selectionStart - 1, selectionEnd - 1);
				return (position = {
					x: oldLine.length * 8.8,
					y: position.y - 22,
				});
			}
			let splitLine = currentLine.split(" ");
			let reducer = 0;
			for (let i = 0; i < splitLine.length; i++) {
				const word = splitLine[i];
				if (reducer + word.length + 1 >= positionX) break;
				reducer += word.length + 1;
			}
			position.x = reducer * 8.8;
			textCode.setSelectionRange(
				selectionStart - (positionX - reducer),
				selectionEnd - (positionX - reducer)
			);
			return;
		}
		if (e.key === KeyboardKeys.ArrowLeft && withShift && !e.ctrlKey) {
			if (selectionEnd - selectionStart === 1) {
				position.x = position.x - 8.8;
				resetStylesInElements();
			}
			return;
		}

		if (e.key === KeyboardKeys.Home && !e.ctrlKey && !withShift) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
			}
			arrowPos = 0;
			position.x = 0;
			return;
		}
		if (e.key === KeyboardKeys.Home && e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
			}
			arrowPos = 0;
			position.x = 0;
			position.y = 0;
		}
		if (e.key === KeyboardKeys.End && !e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
			}
			arrowPos = currentLine.length;
			position.x = currentLine.length * 8.8;
			return;
		}
		if (e.key === KeyboardKeys.End && e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				resetStylesInElements();
			}
			arrowPos = textSplit[textSplit.length - 1].length;
			return (position = {
				x: arrowPos * 8.8,
				y: (textSplit.length - 1) * 22,
			});
		}
	};
	const shadowText = (selection: selectType) => {
		if (!codeLines) return;
		const { start, end } = selection;
		let shadowLines = [...selectedChildren];
		let count = 0;
		if (start.y > 0) {
			let initLine = shadowLines.shift();
			resetStyles(initLine);
		}
		if (end.y < textSplit.length - 1) {
			let endLine = shadowLines.pop();
			resetStyles(endLine);
		}
		for (let i = start.y; i < end.y + 1; i++) {
			const el = shadowLines[count];
			if (end.y === start.y) {
				const { start: sortStart, end: sortEnd } =
					sortSelection(selectionState);
				el.style.left = sortStart.init * 8.8 + "px";
				el.style.width = (sortEnd.init - sortStart.init) * 8.8 + "px";
				break;
			}
			if (count === 0) {
				el.style.left = start.init * 8.8 + "px";
				el.style.width = (textSplit[i].length - start.init) * 8.8 + "px";
			} else if (count === shadowLines.length - 1) {
				el.style.left = 0 + "px";
				el.style.width =
					(textSplit[i].length - (textSplit[i].length - end.init)) * 8.8 + "px";
			} else {
				el.style.left = "0px";
				el.style.width = `${textSplit[i].length * 8.8}px`;
			}
			count += 1;
		}
	};
	const getElementShadow = (children: Array<HTMLElement>) => {
		return children
			.map((c) => {
				return c.firstChild?.firstChild || null;
			})
			.filter((c) => c) as HTMLElement[];
	};
	const sortSelection = (selection: any) => {
		const { start, end } = selection;
		if (start.y === end.y) {
			if (start.init < end.init) {
				return { start: { ...start }, end: { ...end }, direction: 1 };
			}
			return { start: { ...end }, end: { ...start }, direction: 0 };
		}
		if (start.y < end.y) {
			return { start: { ...start }, end: { ...end }, direction: 1 };
		}
		return { start: { ...end }, end: { ...start }, direction: 0 };
	};
	const handleMouseDown = (e: MouseEvent) => {
		selectionWithMouse.isMouseDown = true;
		selectionWithMouse.isMouseMove = false;
		selectionWithMouse.isMouseUp = false;
		resetStylesInElements();
		selectedChildren = codeLines
			? getElementShadow([...codeLines.children].slice(1) as Array<HTMLElement>)
			: [];
		codeChildren = codeLines ? [...codeLines.children].slice(1) : [];
		const { XPosition, YPosition } = getPositionInText(e.pageX, e.pageY);
		arrowPos = XPosition;
		selectionState.start = {
			init: XPosition,
			y: YPosition,
		};
	};
	onMount(() => {
		let handleMouseMove = (e: MouseEvent) => {
			if (selectionWithMouse.isMouseDown) {
				const { XPosition, YPosition } = getPositionInText(e.pageX, e.pageY);
				const { init, y } = selectionState.start;
				if (y === YPosition && Math.abs(XPosition - init) === 0) return;
				selectionWithMouse.isMouseMove = true;
				selectionState.end = {
					init: XPosition,
					y: YPosition,
				};
				let max = Math.max(selectionState.start.y, selectionState.end.y);
				let min = Math.min(selectionState.start.y, selectionState.end.y);
				max = max >= textSplit.length - 1 ? textSplit.length - 1 : max + 1;
				min = min <= 0 ? 0 : min - 1;
				selectedChildren = getElementShadow(codeChildren.slice(min, max + 1));
				position.x = XPosition * 8.8;
				position.y = YPosition * 22;
				shadowText(sortSelection(selectionState));
				return;
			}
		};
		const handleMouseUp = (e: MouseEvent) => {
			if (selectionWithMouse.isMouseDown && !selectionWithMouse.isMouseMove) {
				// selectionState = {
				// 	start: { ...selectionState.start },
				// 	end: { ...selectionState.start },
				// };
				// if (start.init !== end.init && start.y !== end.y) return;
				//
				const { XPosition, YPosition } = getPositionInText(e.pageX, e.pageY);
				let count = 0;
				Arrays.loop(YPosition, (i) => {
					count += textSplit[i].length + 1;
				});
				position.x = XPosition * 8.8;
				position.y = YPosition * 22;
				arrowPos = XPosition;
				isInitialClick = true;
				textCode.setSelectionRange(count + XPosition, count + XPosition);
				textCode.focus();
				selectionWithMouse.isMouseDown = false;
				selectionWithMouse.isMouseMove = false;
				return;
			}
			if (selectionWithMouse.isMouseDown && selectionWithMouse.isMouseMove) {
				const { XPosition, YPosition } = getPositionInText(e.pageX, e.pageY);
				const { start, end, direction } = sortSelection({
					start: selectionState.start,
					end: { init: XPosition, y: YPosition },
				});
				selectionState = { start: { ...start }, end: { ...end } };
				let countStart = { count: 0, selected: false };
				let countEnd = { count: 0, selected: false };
				Arrays.for(textSplit, (line, i) => {
					if (countStart.selected && countEnd.selected) return true;
					if (!countStart.selected) {
						if (i === selectionState.start.y) {
							countStart.count += selectionState.start.init;
							countStart.selected = true;
						} else {
							countStart.count += line.length + 1;
						}
					}
					if (!countEnd.selected) {
						if (i === selectionState.end.y) {
							countEnd.count += selectionState.end.init;
							countEnd.selected = true;
						} else {
							countEnd.count += line.length + 1;
						}
					}
					return false;
				});
				textCode.focus();
				selectionWithMouse.isMouseUp = true;
				textCode.setSelectionRange(
					countStart.count,
					countEnd.count,
					direction === 0 ? "backward" : "forward"
				);
			}
			selectionWithMouse.isMouseDown = false;
			selectionWithMouse.isMouseMove = false;
		};
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	});

	const handleSelect = (e: Event) => {
		if (changeManualSelection || isInitialClick) {
			changeManualSelection = false;
			isInitialClick = false;
			return;
		}
		if (selectionWithMouse.isMouseUp) {
			selectionWithMouse.isMouseUp = false;
			return;
		}
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart, selectionEnd, selectionDirection } = textarea;
		const { start, end } = searchSelection({ selectionStart, selectionEnd });
		selectionState = {
			start: { init: selectionStart - start.init, y: start.i },
			end: { init: selectionEnd - end.init, y: end.i },
		};
		let max = Math.max(selectionState.start.y, selectionState.end.y);
		let min = Math.min(selectionState.start.y, selectionState.end.y);
		max = max >= textSplit.length - 1 ? textSplit.length - 1 : max + 1;
		min = min <= 0 ? 0 : min - 1;
		codeChildren = codeLines ? [...codeLines.children].slice(1) : [];
		selectedChildren = getElementShadow(codeChildren.slice(min, max + 1));
		shadowText(selectionState);
		const selectedCursor = selectionDirection === "backward" ? start : end;
		const selectedSelection =
			selectionDirection === "backward" ? selectionStart : selectionEnd;
		// arrowPos = selectedSelection - selectedCursor.init;
		position.x = (selectedSelection - selectedCursor.init) * 8.8;
		position.y = selectedCursor.i * 22;
	};
	const handleInput = (e: Event) => {
		let event = e as InputEvent;
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart, selectionEnd } = textarea;
		// Hard implementation => 😓
		// if (event.inputType === InputType.insertText && event.data !== null) {
		// 	return (position = {
		// 		x: selectionState.start.init + 8.8,
		// 		y: selectionState.start.y,
		// 	});
		// }
		if (selectionStart !== selectionEnd) {
			return handleSelect(e);
		}
		resetStylesInElements();
		if (event.inputType === InputType.insertText && event.data === null) {
			arrowPos = 0;
			return (position = {
				x: 0,
				y: position.y + 22,
			});
		}
		if (event.inputType === InputType.insertLineBreak) {
			arrowPos = 0;
			return (position = {
				x: 0,
				y: position.y + 22,
			});
		}
		let count = 0;
		let index = 0;
		Arrays.for(textSplit, (line, i) => {
			index = i;
			if (count + line.length >= selectionStart) return true;
			count += line.length + 1;
			return false;
		});
		arrowPos = selectionStart - count;
		return (position = {
			x: (selectionStart - count) * 8.8,
			y: index * 22,
		});
	};
</script>

<section class="Section-Code bg-white" bind:this={codeArea}>
	<div class="display_code grid">
		<!-- <div class="code-index">
			{#each textSplit as line, i}
				<div>{i + 1}</div>
			{/each}
		</div> -->
		<div
			class="code-lines"
			on:keydown={() => {}}
			bind:this={codeLines}
			on:mousedown={handleMouseDown}
		>
			<Cursor
				style="transform:translate({position.x}px,{position.y}px); pointer-events:none;"
			/>
			{#each textSplit as line, i}
				<div
					style="background-color: {Math.floor(position.y / 22) === i
						? 'rgba(195, 198, 216, 0.162)'
						: ''}"
				>
					<SingleLine text={line} />
				</div>
			{/each}
		</div>
	</div>
	<textarea
		name="coder"
		bind:value
		bind:this={textCode}
		autocomplete="off"
		autocapitalize="off"
		autocorrect="off"
		spellcheck={false}
		wrap="off"
		acceptcharset="ut-f8"
		on:keydown={handleKeydown}
		on:select={handleSelect}
		on:input={handleInput}
		on:keydown={(e) => {
			if (e.key === KeyboardKeys.ArrowRight && e.ctrlKey && !e.shiftKey) {
				e.preventDefault();
			}
			if (e.key === KeyboardKeys.ArrowLeft && e.ctrlKey && !e.shiftKey) {
				e.preventDefault();
			}
		}}
	/>
</section>

<style>
	.display_code {
		/* grid-template-columns: 2.5rem 1fr; */
		/* --gap: 0.8rem; */
		padding-left: 0.5em;
	}
	.code-lines {
		min-height: 100vh;
		user-select: none;
		cursor: text;
	}
	/* .code-index > * {
		height: 22px;
	}

	.code-index {
		text-align: end;
		user-select: none;
	} */
	section {
		position: relative;
		font-family: "Consolas";
	}
	textarea {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 200px;
	}
</style>
