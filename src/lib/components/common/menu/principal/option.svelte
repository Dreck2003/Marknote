<script lang="ts">
	export let selected = false;
	export let text = "";
	export let contentClass = "";
</script>

<div class:selected class="Option" on:mouseleave>
	<span on:click on:keydown on:mousemove>
		{text}
	</span>
	{#if selected}
		<div class="Option-Content {contentClass}">
			<slot />
		</div>
	{/if}
</div>

<style>
	.Option.selected {
		background-color: red;
	}
	.Option {
		border: 1px solid blue;
		position: relative;
	}

	.Option-Content {
		border: 1px solid green;
		padding: 0.3em;
		position: absolute;
		right: 0;
		top: 0;
		transform: translate(100%, 0%);
	}
</style>
