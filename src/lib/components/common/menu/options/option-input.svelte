<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { OptionMenu } from "../principal/index";
	export let text = "";
	export let selected = false;
	export let value = "";
	export let handleInput = (e: string): [boolean, string] => [false, ""];
	export let handleKeyDown: (
		e: KeyboardEvent,
		v: string
	) => null | [boolean, string] | void = (e: KeyboardEvent) => null;

	$: !selected &&
		(() => {
			value = "";
			messageAndError = [false, ""];
		})();

	let messageAndError: [boolean, string] = [false, ""];
	let input: HTMLInputElement | null = null;

	$: selected &&
		(() => {
			input && input.focus();
		})();

	const dispatcher = createEventDispatcher();

	const keyDowController = (e: KeyboardEvent) => {
		const res = handleKeyDown(e, value);
		if (Array.isArray(res)) {
			return (messageAndError = res);
		}
		if (e.key === "Enter" && !messageAndError[0]) {
			dispatcher("selectInput", { value });
		}
	};
</script>

<OptionMenu
	{text}
	bind:selected
	on:click
	contentClass="flex flex-d-c bg-white-100 border-200"
>
	<input
		autocorrect="off"
		spellcheck="false"
		autocomplete="off"
		bind:this={input}
		type="text"
		bind:value
		on:keydown={keyDowController}
		on:input={() => {
			messageAndError = handleInput(value);
		}}
		on:click={(e) => {
			e.stopPropagation();
		}}
		class="Option-Input bg-green-200"
	/>
	{#if messageAndError[1].length > 0}
		<p class="Option-message">
			{messageAndError[1]}
		</p>
	{/if}
</OptionMenu>

<style>
	:global(.Option-Content) {
		border: 1px solid lime;
	}

	.Option-Input {
		outline: none;
		border: 0;
	}
</style>
