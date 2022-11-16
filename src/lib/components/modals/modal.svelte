<script lang="ts">
	type positionY = "top" | "center" | "bottom";
	type positionX = "left" | "center" | "rigth";
	export let y: positionY = "center";
	export let x: positionX = "center";
	$: position = (() => {
		let pos = { y: "center", x: "center" };
		if (y == "top") pos.y = "flex-start";
		if (y == "bottom") pos.y = "flex-end";
		if (x == "left") pos.x = "flex-start";
		if (x == "rigth") pos.x = "flex-end";
		return pos;
	})();
</script>

<div class="Modal flex " style:--y={position.y} style:--x={position.x}>
	<slot />
</div>

<style>
	.Modal {
		align-items: var(--y);
		justify-content: var(--x);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #707078 !important;
		/* background-color: rgba(51, 51, 51, 0.854); */
		opacity: 0.9;
		/* backdrop-filter: blur(6px); */
	}
</style>
