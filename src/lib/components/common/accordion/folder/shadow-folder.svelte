<script lang="ts">
	let shadowDiv: HTMLElement | null = null;
	console.log($$props.style);
</script>

<div class="Shadow_Folder" bind:this={shadowDiv} style={$$props.style} />

<style>
	.Shadow_Folder {
		position: absolute;
		left: 0;
		right: 0;
		height: 30px;
		background-color: #abc7c73d;
		border: 1px solid #909a9a99;
		pointer-events: none;
	}
</style>
