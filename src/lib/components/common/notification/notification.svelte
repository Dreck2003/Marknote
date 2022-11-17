<script lang="ts">
	import type { TypeNotification } from "../../../store/store/notifications";
	import { COLORS } from "../../../interfaces/styles";
	import CloseIcon from "../../svg/close-icon.svelte";
	import { fly } from "svelte/transition";

	export let text = "";
	export let type: TypeNotification = "Succes";
	export let style = { color: "", bg: "" };

	type NotifyI = {
		[key in TypeNotification]: string;
	};

	const TypeNotify: Omit<NotifyI, "Custom"> = {
		Danger: `hsla(${COLORS["RedError"]},70%)`,
		Succes: `hsla(${COLORS["GreenError"]},70%)`,
		Info: `hsla(${COLORS["SoftBlueError"]},73%)`,
		Warning: `hsla(${COLORS["OrangeError"]},73%)`,
	};

	$: NotifyStyle = (() => {
		if (type === "Custom") {
			return { ...style };
		}
		return {
			color: `hsla(${COLORS["White000"]})`,
			bg: TypeNotify[type],
		};
	})();
</script>

<div
	class="Notification"
	style:--color={NotifyStyle.color}
	style:--bg={NotifyStyle.bg}
	in:fly={{ x: 15, duration: 500 }}
	out:fly={{ x: 15, duration: 300 }}
>
	{text}
	<CloseIcon
		svgProps={{ width: 20, height: 20 }}
		className="fill-white stroke-white"
		on:click
	/>
</div>

<style>
	.Notification {
		background-color: var(--bg);
		color: var(--color);
		padding: 0.2em 0.5em;
		position: relative;
	}
	:global(.Notification svg) {
		position: absolute;
		top: 2px;
		right: 2px;
		cursor: pointer;
	}
</style>
