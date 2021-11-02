import { showMeal, loadFavourites } from "./utils.js";

loadFavourites().forEach(element => {
    showMeal(element);
});

document.querySelector("#clear-btn").onclick = (e) => {
    localStorage.clear()
    document.querySelector("#output").innerHTML = ""
}