<script lang="ts">
	import { FileReaderStore } from "../../../../store/store";
	export let name = "";
	export let content = "";
	export let path = "";
	export let padding = false;
	export let folderId = Symbol(null);
	export let id: symbol = Symbol("");
	const handleClick = () => {
		if ($FileReaderStore.id != id) {
			FileReaderStore.set({
				name,
				isEmpty: false,
				content,
				path,
				id,
				folderId,
			});
		}
	};
</script>

<div
	class="Folder_Content-File flex a-i-center"
	style="padding-left:{padding ? '3em' : '1em'}"
	on:click={handleClick}
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
