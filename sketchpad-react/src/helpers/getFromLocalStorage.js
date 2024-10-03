export function getFromLocalStorage(localStorageKey) {
	return JSON.parse(localStorage.getItem(localStorageKey));
}
