<script lang="ts">
	import { COLORS } from "../../../../interfaces/styles";
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
	$: existError = messageAndError[1].length > 0;

	$: dangerColor = existError ? "bg-red-100" : "bg-green-300";

	$: style = {
		parent: "",
		content: existError ? `border:1px solid hsla(${COLORS["Red400"]});` : "",
	};
</script>

<OptionMenu
	{text}
	bind:selected
	on:click
	contentClass="flex flex-d-c {dangerColor} border-200"
	hover={`hsla(${COLORS["Green200"]},60%)`}
	{style}
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
		class="Option-Input text-gray-700"
	/>
	{#if messageAndError[1].length > 0}
		<p class="Option-message text-red-500 fs-200">
			{messageAndError[1]}
		</p>
	{/if}
</OptionMenu>

<style>
	.Option-message {
		margin: 0;
		padding: 0.2em;
	}

	:global(.Option) {
		padding: 0.3em 0.5em;
	}

	.Option-Input {
		outline: none;
		border: 0;
	}

	input {
		height: 1.3rem;
	}
	/* .Option-message{
		color: ;
	} */
</style>
