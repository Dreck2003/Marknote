<script lang="ts">
	import type { TypeNotification } from "../../../store/store/notifications";
	import { COLORS } from "../../../interfaces/styles";
	import CloseIcon from "../../svg/close-icon.svelte";

	export let text = "";
	export let type: TypeNotification = "Succes";
	export let style = { color: "", bg: "" };

	type NotifyI = {
		[key in TypeNotification]: string;
	};

	const TypeNotify: Omit<NotifyI, "Custom"> = {
		Danger: COLORS["Red300"],
		Succes: COLORS["Green300"],
		Info: "44, 61%, 54%", //COLORS["Green300"],
		Warning: "32, 50%, 54%", //COLORS["Gray300"],
	};

	$: NotifyStyle = (() => {
		if (type === "Custom") {
			return { ...style };
		}
		return {
			color: `hsla(${COLORS["White000"]})`,
			bg: `hsla(${TypeNotify[type]})`,
		};
	})();
</script>

<div
	class="Notification"
	style:--color={NotifyStyle.color}
	style:--bg={NotifyStyle.bg}
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
		/* border: 1px solid red; */
		padding: 0.2em 0.5em;
		position: relative;
	}
	:global(.Notification svg) {
		position: absolute;
		top: 0;
		right: 0;
	}
</style>
