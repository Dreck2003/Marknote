<script lang="ts">
	export let selected = false;
	export let text = "";
	export let contentClass = "";
	export let optionClass = "";
	export let hover = "";
	export let style = { parent: "", content: "" };
</script>

<div
	class:selected
	class="Option {optionClass}"
	on:mouseleave
	style:--hover={hover}
	style={style.parent}
>
	<span on:click on:keydown on:mousemove>
		{text}
	</span>
	{#if selected && $$slots.default}
		<div class="Option-Content {contentClass}" style={style.content}>
			<slot />
		</div>
	{/if}
</div>

<style>
	.Option {
		position: relative;
		transition: background-color 100ms ease;
	}

	.Option.selected {
		background-color: var(--hover);
	}

	.Option:hover {
		background-color: var(--hover);
	}

	.Option-Content {
		padding: 0.3em;
		position: absolute;
		right: 0;
		top: 0;
		transform: translate(100.5%, 0%);
	}
</style>
