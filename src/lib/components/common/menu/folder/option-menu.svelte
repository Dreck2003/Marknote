<script lang="ts">
	import { MenuOptionsFolder } from "../../../../interfaces/files/folder-menu";
	export let inputValue: string;
	export let withInput = false;
	export let showInput = false;
	export let optionId: MenuOptionsFolder;
	export let dispatchClick = () => {};
	export let text = "";
	export let handleKeyDown =
		(option: MenuOptionsFolder) => (e: KeyboardEvent) => {};
	let input: HTMLInputElement | null = null;
</script>

<span
	on:click={() => {
		dispatchClick();
		if (input) {
			setTimeout(() => {
				input.focus();
			}, 100);
		}
	}}
	on:keydown
	id={MenuOptionsFolder.createFolder}
>
	{#if withInput}
		<input
			bind:this={input}
			type="text"
			bind:value={inputValue}
			class:show={showInput}
			on:keydown={handleKeyDown(optionId)}
		/>
	{/if}
	{text}
</span>

<style>
	span {
		padding: 0.3em 0.8em;
		position: relative;
	}
	span > input {
		position: absolute;
		right: 0;
		border: 1px solid rgb(90, 99, 153);
		color: rgb(90, 99, 153);
		transform: translate(102%, 0);
		visibility: hidden;
	}
	span > input.show {
		visibility: visible;
	}

	span:hover {
		background-color: rgba(103, 128, 204, 0.639);
	}
</style>
