<script lang="ts">
	export let markdown = "";
</script>

<div class="Render-Markdown">
	{@html markdown}
</div>

<style>
	.Render-Markdown {
		padding: 1em;
	}
	* {
		font-size: initial;
	}

	:global(h1, h2, h3, h4, h5, h6) {
		color: rgb(66, 67, 69);
	}
	:global(h1) {
		font-size: 2rem;
	}
	:global(h2) {
		font-size: 1.65rem;
	}
	:global(h3) {
		font-size: 1.45rem;
	}
	:global(h4) {
		font-size: 1.155rem;
	}
	:global(h5) {
		font-size: 0.845rem;
	}
	:global(h6) {
		font-size: 0.755rem;
	}
	:global(code) {
		background-color: #0000000d;
		border-radius: 4px;
		display: block;
		overflow-x: auto;
		padding: 0.5em;
	}
	:global(blockquote) {
		border-left: 5px solid #0000001a;
		color: #00000080;
		padding-left: 1.2em;
		margin: 0.5em 1em;
	}

	:global(code) {
		background-color: #f6f6f6;
	}
</style>
