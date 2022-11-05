<script lang="ts">
	import { FileReaderStore } from "../../../../store/store";

	export let name = "";
	export let content = "";
	export let padding = false;
</script>

<div
	class="Folder_Content-File flex a-i-center"
	style="padding-left:{padding ? '3em' : '1em'}"
	on:click={() =>
		FileReaderStore.set({
			name,
			isEmpty: false,
			content,
		})}
	on:keydown
>
	{name}
</div>

<style>
	.Folder_Content-File {
		cursor: pointer;
		height: 30px;
	}
	.Folder_Content-File:hover {
		background-color: #b4ccee84;
	}
</style>
