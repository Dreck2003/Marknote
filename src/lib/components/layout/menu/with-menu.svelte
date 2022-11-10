<script lang="ts">
	export let visible = false;
</script>

<div class="Wrapper_Menu" style={$$props.style}>
	<slot name="child" />
	{#if visible}
		<div class="Custom_Menu">menu</div>
	{/if}
</div>

<style>
	.Wrapper_Menu {
		position: relative;
	}

	.Custom_Menu {
		border: 2px solid dodgerblue;
		position: absolute;
		bottom: 0;
		transform: translate(0, 100%);
	}
</style>
