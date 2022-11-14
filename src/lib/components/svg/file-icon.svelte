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
	><path
		d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm8 7h-1V4l5 5h-4z"
	/></svg
>
