import { LOCALSTORAGE_TODO_DATA } from '../../consts/consts.js';

export function getFromLocalStorage() {
	return JSON.parse(localStorage.getItem(LOCALSTORAGE_TODO_DATA));
}
