<script>
	import { saveFile } from "../../utils/files/files";
	import {
		CodeAreaStore,
		FileReaderStore,
		FolderStoreAction,
		NotificationStoreActions,
	} from "../../store/store";
	import { NotificationStore } from "../../store/store";
	import Modal from "../modals/modal.svelte";

	$: showModal = $NotificationStore.showModal;

	const handleSaveFile = () => {
		console.log("save file");
		saveFile($FileReaderStore.path, $CodeAreaStore.content)
			.then((e) => {
				$FileReaderStore.content = $CodeAreaStore.content;
				FolderStoreAction.saveFile(
					$FileReaderStore.folderId,
					$FileReaderStore.id,
					$CodeAreaStore.content
				);
			})
			.catch((e) => {
				NotificationStoreActions.add({
					type: "Danger",
					content: "Error to save file",
				});
			})
			.finally(() => {
				$CodeAreaStore.saved = true;
				$NotificationStore.showModal = false;
			});
	};
</script>

{#if showModal}
	<Modal>
		<div class="Modal-Content bg-white">
			<div>
				<h3 class="text-gray-600">Save File</h3>
				<hr class="bg-gray-200" />
				<section class="Modal-Content-Text">
					This file is not saved. Are you sure you don't save the file? <br />
					Changes made will not be saved. 🤔
				</section>
				<hr class="bg-gray-200" />
				<div class="Modal-Buttons flex flex-d-r j-c-f-end">
					<button class="bg-green-300 text-white" on:click={handleSaveFile}>
						Save
					</button>
					<button
						class="bg-gray-100"
						on:click={() => {
							$CodeAreaStore.saved = true;
							$CodeAreaStore.content = $FileReaderStore.content ?? "";
							$FileReaderStore.content = $FileReaderStore.content;
							showModal = false;
						}}
					>
						Do not save
					</button>
					<button
						class="bg-gray-100 "
						on:click={() => {
							showModal = false;
						}}
					>
						Close
					</button>
				</div>
			</div>
		</div>
	</Modal>
{/if}

<style>
	.Modal-Content {
		border-radius: 4px;
		max-width: 90%;
		width: 400px;
	}
	.Modal-Content > div > :not(hr) {
		margin: 0.6em;
	}

	.Modal-Content > div :is(hr) {
		border: 0;
		height: 1px;
	}

	.Modal-Content h3 {
		margin: 0;
		margin: 0.4em;
	}

	.Modal-Content section {
		font-size: 0.92rem;
	}

	.Modal-Buttons > button {
		border: 0;
		border-radius: 3px;
		padding: 0.5em 0.6em;
	}
</style>
