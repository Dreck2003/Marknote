<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import { COLORS } from "../../interfaces/styles";
	import { FileReaderStore } from "../../store/store";
	import CloseIcon from "../svg/close-icon.svelte";
	// import Dots from "../svg/dots.svelte";
	import EyeIcon from "../svg/eye-icon.svelte";
	import PencilIcon from "../svg/pencil-icon.svelte";

	export let isWrite = false;
	const dispatch = createEventDispatcher();
</script>

<nav class="Top-Bar bg-gray-100 flex flex-d-r">
	<h5 class="">{$FileReaderStore.name ?? "No have name"}</h5>
	<ul class="flex flex-d-r">
		<li title={isWrite ? "Write file" : "View markdown"}>
			{#if isWrite}
				<PencilIcon
					svgProps={{
						height: 22,
						width: 22,
						stroke: `hsla(${COLORS["Green300"]})`,
					}}
					className="fill-green-300"
					on:click={() => {
						dispatch("writeFile", {});
					}}
				/>
			{/if}
			{#if !isWrite}
				<EyeIcon
					svgProps={{
						height: 22,
						width: 22,
						stroke: `hsla(${COLORS["Green300"]})`,
					}}
					className="fill-green-300"
					on:click={() => {
						dispatch("seeMarkdown", {});
					}}
				/>
			{/if}
		</li>
		<li>
			<CloseIcon
				svgProps={{
					stroke: `hsla(${COLORS["Green300"]})`,
				}}
				className="fill-green-300"
				on:click={() => {
					dispatch("closeFile", {});
				}}
			/>
		</li>
		<!-- <li>
			<Dots />
		</li> -->
	</ul>
</nav>

<style>
	.Top-Bar {
		height: 2.5rem;
		border: 1px solid rgba(74, 75, 77, 0.445);
		align-items: center;
		justify-content: space-between;
		height: 40px;
		position: sticky;
		top: 0;
	}

	.Top-Bar h5 {
		margin: 0;
		margin-left: 1em;
		/* display: inline-block; */
	}

	.Top-Bar > ul {
		/* display: inline-flex; */
		list-style: none;
		--gap: 1em;
		margin-right: 2em;
	}
	.Top-Bar > ul li {
		cursor: pointer;
		display: flex;
	}
</style>
