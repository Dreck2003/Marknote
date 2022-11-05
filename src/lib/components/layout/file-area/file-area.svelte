<script lang="ts">
	import { FileReaderStore } from "../../../store/store";
	import CodeArea from "../../specific/code-area/code_area.svelte";
</script>

<section>
	{#if $FileReaderStore.isEmpty}
		<b>Not File Selected</b>
	{:else}
		<CodeArea value={$FileReaderStore.content ?? ""} />
	{/if}
</section>
