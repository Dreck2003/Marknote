<script lang="ts">
	import {
		NotificationStore,
		NotificationStoreActions,
	} from "../../../store/store/notifications";
	import Notification from "../../common/notification/notification.svelte";
</script>

<section
	class="Notify-Containers flex flex-d-c"
	class:hidden={$NotificationStore.notifications.length == 0}
>
	{#each $NotificationStore.notifications as notify (notify.id)}
		<Notification
			text={notify.content}
			type={notify.type}
			on:click={(e) => {
				e.preventDefault();
				NotificationStoreActions.remove(notify.id);
			}}
		/>
	{/each}
</section>

<style>
	.Notify-Containers {
		--gap: 0.5em;
		/* border: 2px solid slateblue; */
		bottom: 0;
		position: fixed;
		right: 0.2em;
		height: 12em;
		width: 22em;
		overflow: auto;
		/* padding-right: 0.2em; */
		margin-right: 0.5em;
	}

	.Notify-Containers.hidden {
		display: none;
	}

	.Notify-Containers::-webkit-scrollbar {
		width: 0.2em;
		height: 0.2em;
		/* margin-left: 10em; */
		/* display: none; */
	}
	.Notify-Containers::-webkit-scrollbar-thumb {
		background: #ccc;
		border-radius: 4px;
	}
	.Notify-Containers::-webkit-scrollbar-track {
		background: #e1e1e1;
		border-radius: 4px;
	}
</style>
