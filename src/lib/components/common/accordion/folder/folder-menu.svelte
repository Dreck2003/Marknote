<script lang="ts">
	import { MenuOptionsFolder } from "../../../../interfaces/files/folder-menu";

	export let visible = false;
	export let id = "";
	export let y = "0px";
</script>

{#if visible}
	<div class="Custom_Menu flex" {id} style:top={y}>
		<span on:click on:keydown id={MenuOptionsFolder.createFolder}
			>Create folder</span
		>
		<span on:click on:keydown id={MenuOptionsFolder.createFile}
			>Create file</span
		>
		<span on:click on:keydown id={MenuOptionsFolder.deleteFolder}>Delete</span>
		<span on:click on:keydown id={MenuOptionsFolder.renameFolder}>Rename</span>
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
		overflow: hidden;
		color: white;
		cursor: pointer;
	}
	.Custom_Menu > span {
		padding: 0.3em 0.8em;
	}

	.Custom_Menu > span:hover {
		background-color: rgba(103, 128, 204, 0.639);
	}
</style>
