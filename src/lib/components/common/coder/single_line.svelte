<script lang="ts">
	import { getWords } from "../../../utils/arrays/Arrays";
	import { ContextCodeArea } from "../../../utils/code_area_util";
	export let text = "";
	$: words = getWords(text).map((word) => {
		if (ContextCodeArea.sintax[word])
			return { word, color: ContextCodeArea.sintax[word] };
		return { word, color: "black" };
	});
</script>

<div class="code_container-lines" style={$$props.style}>
	<b class="code_container-shadow" />
	{#each words as { word, color }}
		{#if word === " "}
			<span>&nbsp;</span>
		{:else}
			<span style="color: {color};">
				{word}
			</span>
		{/if}
	{/each}
</div>

<style>
	span {
		display: inline-block;
	}
	.code_container-lines {
		height: 22px;
		width: max-content;
		position: relative;
		background-color: unset;
	}
	.code_container-shadow {
		position: absolute;
		height: 22px;
		left: 0;
		width: 0;
		background-color: #0030ff17;
		border-radius: 4px;
	}
</style>
