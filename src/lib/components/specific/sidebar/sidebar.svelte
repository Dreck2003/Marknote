<script lang="ts">
	import Folder from "../../common/accordion/folder/folder.svelte";
	import ShadowFolder from "../../common/accordion/folder/shadow-folder.svelte";
	import { FolderStore } from "../../../store/store";
	let y = 0;
	const handleClickFolder = (e: MouseEvent, height: number) => {
		y = Math.trunc(e.pageY / (height * 1.1)) * height;
	};
</script>

<section class="Sidebar bg-gray-100">
	<div>
		<!--folder principal, create files, folders HERE  -->
	</div>
	<div style="position: relative;">
		<ShadowFolder bind:y style="transform: translate(0px,{y ?? 0}px);" />
		<Folder expanded content={$FolderStore} click={handleClickFolder} />
	</div>
</section>

<style>
	.Sidebar {
		padding-top: 0.5em;
	}
</style>
