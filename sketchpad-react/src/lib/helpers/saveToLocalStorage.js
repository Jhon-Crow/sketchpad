import { LOCALSTORAGE_TODO_DATA } from '../../consts/consts.js';

export function saveToLocalStorage(arrayOfObjects) {
	localStorage.setItem(LOCALSTORAGE_TODO_DATA, JSON.stringify(arrayOfObjects));
}
