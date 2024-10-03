export function saveToLocalStorage(itemToSave, localStorageKey) {
	localStorage.setItem(localStorageKey, JSON.stringify(itemToSave));
}
