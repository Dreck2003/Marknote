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
	id: symbol;
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
	add(notify: Omit<Notification, "id">) {
		NotificationStore.update((n) => ({
			...n,
			notifications: n.notifications.concat({ ...notify, id: Symbol("") }),
		}));
	},
	getStore() {
		return getValue();
	},
	remove(i: symbol) {
		NotificationStore.update((n) => ({
			...n,
			notifications: n.notifications.filter(({ id }) => id !== i),
		}));
	},
};
