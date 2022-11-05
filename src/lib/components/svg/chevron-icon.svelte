<script lang="ts">
	import {
		getRotate,
		SvgDefaultProps,
		type PositionArrow,
		type SvgProps,
	} from "../../interfaces/svg";
	export let svgProps: SvgProps = {};
	export let style = "";
	export let position: PositionArrow = "down";
	$: props = { ...SvgDefaultProps(), ...svgProps };
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{...props}
	style="transform: rotate({getRotate(position)});{style}"
	><path
		d="M16.293 9.293 12 13.586 7.707 9.293l-1.414 1.414L12 16.414l5.707-5.707z"
	/></svg
>

<style>
	.rata {
		transform: rotateX(45deg);
	}
</style>
