<script lang="ts">
	import Sidebar from "./lib/components/specific/sidebar/sidebar.svelte";
</script>

<main class="grid" style="height: 100%;">
	<Sidebar />
	<section class="bg-white-100">code area</section>
	<div />
	<div />
</main>

<style>
	main {
		grid-template-columns: 200px 1fr;
		--gap: 0;
	}
</style>
