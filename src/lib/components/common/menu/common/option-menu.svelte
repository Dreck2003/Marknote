<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { MenuOptionsFolder } from "../../../../interfaces/files/folder-menu";
	export let inputValue = "";
	export let withInput = false;
	export let showInput = false;
	export let dispatchClick = () => {};
	export let text = "";
	export let handleKeyDown: (
		e: KeyboardEvent,
		v: string
	) => null | [boolean, string] | void = (e: KeyboardEvent) => null;
	export let handleInput = (e: string): [boolean, string] => [false, ""];

	let messageAndError: [boolean, string] = [false, ""];
	$: !showInput && (() => (inputValue = ""))();

	const dispatcher = createEventDispatcher();

	let input: HTMLInputElement | null = null;

	const keyDowController = (e: KeyboardEvent) => {
		const res = handleKeyDown(e, inputValue);
		if (Array.isArray(res)) {
			return (messageAndError = res);
		}
		if (e.key === "Enter" && !messageAndError[0]) {
			dispatcher("selectInput", { value: inputValue });
		}
	};
</script>

<div
	on:click={() => {
		dispatchClick();
		showInput = !showInput;
		if (input) {
			setTimeout(() => {
				input.focus();
			}, 100);
		}
	}}
	on:keydown
	id={MenuOptionsFolder.createFolder}
	class="Option"
>
	{#if withInput}
		<div class:show={showInput}>
			<input
				autocorrect="off"
				spellcheck="false"
				autocomplete="off"
				bind:this={input}
				type="text"
				bind:value={inputValue}
				on:keydown={keyDowController}
				on:input={() => {
					messageAndError = handleInput(inputValue);
				}}
			/>
			{#if messageAndError.length > 0}
				<p class="Option-message">
					{messageAndError[1]}
				</p>
			{/if}
		</div>
	{/if}
	{text}
</div>

<style>
	.Option {
		padding: 0.3em 0.8em;
		position: relative;
	}
	.Option > div {
		position: absolute;
		right: 0;
		border: 1px solid rgb(90, 99, 153);
		color: rgb(90, 99, 153);
		transform: translate(102%, 0);
		visibility: hidden;
	}
	.Option > div.show {
		visibility: visible;
	}
	.Option .Option-message {
		font-size: 0.625rem;
		line-height: 1rem;
	}

	.Option:hover {
		background-color: rgba(103, 128, 204, 0.639);
	}
</style>
