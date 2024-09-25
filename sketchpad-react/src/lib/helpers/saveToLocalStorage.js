import {LOCALSTORAGE_SKETCHPAD_DATA} from "../../consts/consts.js";

export function saveToLocalStorage(arrayOfObjects) {
	localStorage.setItem(LOCALSTORAGE_SKETCHPAD_DATA, JSON.stringify(arrayOfObjects));
}
