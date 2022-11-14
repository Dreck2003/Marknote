<script lang="ts">
	import FolderIcon from "../../../svg/folder-icon.svelte";
	import OpenFolderIcon from "../../../svg/open-folder-icon.svelte";

	export let expanded = false;
</script>

{#if expanded}
	<OpenFolderIcon
		svgProps={{ "stroke-width": 0.1, width: 22, height: 22 }}
		className="fill-green-300 stroke-green-400"
	/>
{:else}
	<FolderIcon
		svgProps={{ "stroke-width": 0.1, width: 22, height: 22 }}
		className="fill-green-300 stroke-green-400"
	/>
{/if}
