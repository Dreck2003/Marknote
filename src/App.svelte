<script lang="ts">
	import FileArea from "./lib/components/layout/file-area/file-area.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
</script>

<main class="grid" style="height: 100%;">
	<Sidebar />
	<FileArea />
</main>

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
