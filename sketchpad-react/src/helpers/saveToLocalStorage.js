export function saveToLocalStorage(itemToSave, localStorageKey) {
	if (itemToSave === undefined) {
		console.error('Try to save undefined to localStorage');
	} else {
		localStorage.setItem(localStorageKey, JSON.stringify(itemToSave));
	}
}
