<script lang="ts">
	import { SvgDefaultProps, type SvgProps } from "../../interfaces/svg";

	export let svgProps: SvgProps = {};
	export let className = "";
	$: props = { ...SvgDefaultProps(), ...svgProps };
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	{...props}
	class={className}
	style={$$props.style}
	on:click
	><path
		d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
	/></svg
>
