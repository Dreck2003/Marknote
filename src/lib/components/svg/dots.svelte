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
>
	<path
		d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
	/>
</svg>
