import { writable } from "svelte/store";

export type TypeNotification =
	| "Danger"
	| "Succes"
	| "Info"
	| "Warning"
	| "Custom";
export interface Notification {
	type: TypeNotification;
	content: string;
}

export interface NotificationStoreI {
	notifications: Notification[];
}

export const NotificationStore = writable<NotificationStoreI>({
	notifications: [],
});

const getValue = (): NotificationStoreI => {
	let data: NotificationStoreI;
	const unsubscribe = NotificationStore.subscribe((d) => (data = d));
	unsubscribe();
	return data;
};

export const NotificationStoreActions = {
	add(notify: Notification) {
		NotificationStore.update((n) => ({
			...n,
			notifications: n.notifications.concat(notify),
		}));
	},
	getStore() {
		return getValue();
	},
	remove(index: number) {
		const state = getValue();
		const before = state.notifications.slice(0, index);
		const after = state.notifications.slice(index + 1);
		NotificationStore.update((n) => ({
			...n,
			notifications: before.concat(after),
		}));
	},
};
