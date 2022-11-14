<script lang="ts">
	import { COLORS } from "../../../../interfaces/styles";
	import { clickOutside } from "../../../../utils/custom-events";
	export let visible = false;
	export let y = 0;
	export let color = COLORS["Green300"];
</script>

{#if visible}
	<div
		class="Custom_Menu flex bg-white-100"
		style:top={y + "px"}
		use:clickOutside
		on:outclick
		style:--bg={color}
	>
		<slot />
	</div>
{/if}

<style>
	.Custom_Menu {
		border: 1px solid slateblue;
		border-radius: 4px;
		cursor: pointer;
		flex-direction: column;
		padding: 0.3em 0em;
		position: absolute;
		right: -1.3em;
		z-index: 99;
	}

	:global(.Custom_Menu > div:first-child) {
		border-top-left-radius: 4px;
		border-top-right-radius: 4px;
	}
	:global(.Custom_Menu > div:last-child) {
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
</style>
