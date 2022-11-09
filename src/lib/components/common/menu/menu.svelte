<script lang="ts">
	import { clickOutside } from "../../../utils/custom-events";
	export let visible = false;
	export let y = 0;
</script>

{#if visible}
	<div
		class="Custom_Menu flex"
		style:top={y + "px"}
		use:clickOutside
		on:outclick
	>
		<slot />
	</div>
{/if}

<style>
	.Custom_Menu {
		position: absolute;
		right: -1.3em;
		z-index: 99;
		background-color: rgb(90, 99, 153);
		border-radius: 4px;
		flex-direction: column;
		color: white;
		cursor: pointer;
	}
</style>
