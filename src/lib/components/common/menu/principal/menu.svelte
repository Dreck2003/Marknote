<script lang="ts">
	import { clickOutside } from "../../../../utils/custom-events";
	export let visible = false;
	export let y = 0;
	export let className = "";
	export let customStyle = { bg: "", color: "black" };
</script>

{#if visible}
	<div
		class="Custom_Menu {className}"
		style:top={y + "px"}
		use:clickOutside
		on:outclick
		style:--bg={customStyle.bg}
		style:--color={customStyle.color}
	>
		<slot />
	</div>
{/if}

<style>
	.Custom_Menu {
		background-color: var(--bg);
		border-radius: 4px;
		cursor: pointer;
		flex-direction: column;
		/* padding: 0.3em 0em; */
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
