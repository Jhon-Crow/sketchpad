export function saveToLocalStorage(itemToSave, localStorageKey) {
	if (itemToSave === undefined) {
		return undefined;
	} else {
		localStorage.setItem(localStorageKey, JSON.stringify(itemToSave));
	}
}
