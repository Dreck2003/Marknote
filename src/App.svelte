<script lang="ts">
	import CodeArea from "./lib/components/specific/code_area.svelte";
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
</script>

<main class="grid" style="height: 100%;">
	<Sidebar />
	<CodeArea />
</main>

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
