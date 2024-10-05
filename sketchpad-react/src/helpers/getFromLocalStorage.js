export function getFromLocalStorage(localStorageKey) {
	if (localStorage.getItem(localStorageKey) === undefined){
		return undefined;
	} else {
		return JSON.parse(localStorage.getItem(localStorageKey));
	}
}
