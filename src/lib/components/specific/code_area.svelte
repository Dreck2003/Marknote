<script lang="ts">
	import { Arrays } from "../../utils/arrays/Arrays";
	import { KeyboardKeys } from "../../interfaces/keyboard/keyboard";
	import Cursor from "../common/coder/cursor.svelte";
	import SingleLine from "../common/coder/single_line.svelte";
	import { ContextCodeArea } from "../../utils/code_area_util";
	import { InputType } from "../../interfaces/inputs";
	export let value =
		"import React from 'react';\nimport svelte from 'svelte' \nexport let Dikson='Dikson'\n \njajaj";
	let textCode: HTMLTextAreaElement | null = null;
	let codeArea: HTMLElement | null = null;
	let codeLines: HTMLElement | null = null;
	let position = { x: 0, y: 0 };
	let arrowPos = 0;
	let selectionState = { start: { init: 0, y: 0 }, end: { init: 0, y: 0 } };
	let changeManualSelection = false;
	let isInitialClick = false;

	const fixedNumber = (n: number, size: number): number => {
		const number = Number(n.toFixed(size));
		return number === 0 ? 0 : number;
	};

	$: textSplit = value.split("\n");

	const handleKeydown = async (e: KeyboardEvent) => {
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart, selectionEnd, selectionDirection } = textarea;
		const haveSelection = selectionStart !== selectionEnd;
		// console.clear();
		let y = Number((position.y / 22).toFixed(1));
		let currentLine = textSplit[y] || "";
		let lineLength = currentLine.length;
		let positionX = fixedNumber(position.x / 8.8, 1);
		let withShift = e.shiftKey;

		if (e.key === KeyboardKeys.ArrowDown && !withShift) {
			if (y + 1 === textSplit.length) {
				position = {
					x: currentLine.length * 8.8,
					y: position.y,
				};
				return;
			}
			if (y + 1 > textSplit.length) return;
			let nextLine = textSplit[y + 1];
			if (nextLine.length < arrowPos) {
				return (position = {
					x: nextLine.length * 8.8,
					y: position.y + 22,
				});
			}
			position = {
				x: arrowPos * 8.8,
				y: position.y + ContextCodeArea.style.height,
			};
			return;
		}
		if (e.key === KeyboardKeys.ArrowUp && !withShift) {
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
			position = {
				x: arrowPos * 8.8,
				y: position.y - ContextCodeArea.style.height,
			};
			return;
		}
		if (e.key === KeyboardKeys.ArrowRight && !withShift && !e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				return (position = {
					x: selectionState.end.init,
					y: selectionState.end.y,
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
			position = {
				x: position.x + 8.8,
				y: position.y,
			};
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
			return (position = {
				x: reducer * 8.8,
				y: position.y,
			});
		}
		if (e.key === KeyboardKeys.ArrowLeft && !withShift && !e.ctrlKey) {
			if (selectionStart !== selectionEnd) {
				return (position = {
					x: selectionState.start.init,
					y: selectionState.start.y,
				});
			}
			if (positionX == 0 && y === 0) return;
			if (positionX == 0 && y > 0) {
				let oldLine = textSplit[y - 1];
				position = {
					x: oldLine.length * 8.8,
					y: position.y - ContextCodeArea.style.height,
				};
				arrowPos = oldLine.length;
				return;
			}
			position = {
				x: position.x - 8.8,
				y: position.y,
			};
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
			position = {
				x: reducer * 8.8,
				y: position.y,
			};
			textCode.setSelectionRange(
				selectionStart - (positionX - reducer),
				selectionEnd - (positionX - reducer)
			);
			return;
		}

		if (e.key === KeyboardKeys.Home && !e.ctrlKey) {
			arrowPos = 0;
			return (position = {
				x: 0,
				y: position.y,
			});
		}
		if (e.key === KeyboardKeys.Home && e.ctrlKey) {
			arrowPos = 0;
			return (position = {
				x: 0,
				y: 0,
			});
		}
		if (e.key === KeyboardKeys.End && !e.ctrlKey) {
			arrowPos = currentLine.length;
			return (position = {
				x: currentLine.length * 8.8,
				y: position.y,
			});
		}
		if (e.key === KeyboardKeys.End && e.ctrlKey) {
			arrowPos = textSplit[textSplit.length - 1].length;
			return (position = {
				x: textSplit[textSplit.length - 1].length * 8.8,
				y: (textSplit.length - 1) * 22,
			});
		}
	};
	const handleClickCodeArea = (e: MouseEvent) => {
		console.clear();
		const { offsetLeft } = codeArea;
		const x = e.pageX - (offsetLeft + codeLines.offsetLeft);
		let XPosition = fixedNumber(x / 8.8, 0);
		let YPosition = Math.floor(e.pageY / 22);
		if (YPosition >= textSplit.length) YPosition = textSplit.length - 1;
		let currentLineLength = textSplit[YPosition].length;
		if (XPosition >= currentLineLength) XPosition = currentLineLength;
		let count = 0;
		Arrays.loop(YPosition, (i) => {
			count += textSplit[i].length + 1;
		});
		position = {
			x: XPosition * 8.8,
			y: YPosition * 22,
		};
		arrowPos = XPosition;
		isInitialClick = true;
		textCode.setSelectionRange(count + XPosition, count + XPosition);
		textCode.focus();
		return;
	};
	const handleSelect = (e: Event) => {
		if (changeManualSelection || isInitialClick) {
			changeManualSelection = false;
			isInitialClick = false;
			return;
		}
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart, selectionEnd, selectionDirection } = textarea;
		const start = { init: 0, i: 0, selected: false };
		const end = { init: 0, i: 0, selected: false };
		Arrays.for(textSplit, (line, i) => {
			let length = line.length;
			if (start.selected && end.selected) return true;
			if (!start.selected) {
				if (start.init + length >= selectionStart) {
					start.i = i;
					start.selected = true;
				} else {
					start.i = i;
					start.init += length + 1;
				}
			}
			if (!end.selected) {
				if (end.init + length >= selectionEnd) {
					end.i = i;
					end.selected = true;
				} else {
					end.i = i;
					end.init += length + 1;
				}
			}
			return false;
		});
		selectionState = {
			start: { init: (selectionStart - start.init) * 8.8, y: start.i * 22 },
			end: { init: (selectionEnd - end.init) * 8.8, y: end.i * 22 },
		};
		const selectedCursor = selectionDirection === "backward" ? start : end;
		const selectedSelection =
			selectionDirection === "backward" ? selectionStart : selectionEnd;
		position = {
			x: (selectedSelection - selectedCursor.init) * 8.8,
			y: selectedCursor.i * 22,
		};
	};
	const handleInput = (e: Event) => {
		let event = e as InputEvent;
		const textarea = e.target as HTMLTextAreaElement;
		const { selectionStart } = textarea;
		// Hard implementation => 😓
		// if (event.inputType === InputType.insertText && event.data !== null) {
		// 	return (position = {
		// 		x: selectionState.start.init + 8.8,
		// 		y: selectionState.start.y,
		// 	});
		// }
		if (event.inputType === InputType.insertText && event.data === null) {
			return (position = {
				x: 0,
				y: position.y + 22,
			});
		}
		if (event.inputType === InputType.insertLineBreak) {
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

		return (position = {
			x: (selectionStart - count) * 8.8,
			y: index * 22,
		});
	};
</script>

<section class="bg-white-100" bind:this={codeArea}>
	<div class="display_code grid">
		<div class="code-index">
			{#each textSplit as line, i}
				<div>{i}</div>
			{/each}
		</div>
		<div
			class="code-lines"
			on:click={handleClickCodeArea}
			on:keydown={() => {}}
			bind:this={codeLines}
		>
			<Cursor
				style="transform:translate({position.x}px,{position.y}px); pointer-events:none;"
			/>
			{#each textSplit as line, i}
				<SingleLine text={line} />
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
		grid-template-columns: 2.5rem 1fr;
		--gap: 0.8rem;
	}
	.code-lines {
		min-height: 100vh;
	}
	.code-index > * {
		height: 22px;
	}

	.code-index {
		text-align: end;
	}
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
