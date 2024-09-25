import {LOCALSTORAGE_SKETCHPAD_DATA} from "../../consts/consts.js";

export function getFromLocalStorage() {
	return JSON.parse(localStorage.getItem(LOCALSTORAGE_SKETCHPAD_DATA));
}
