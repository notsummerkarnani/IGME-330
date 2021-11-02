import { showMeal, loadFavourites } from "./utils.js";

loadFavourites().forEach(element => {
    showMeal(element);
});

document.querySelector("#clear-btn").onclick = (e) => {
    localStorage.removeItem("srk7473-favourites");
    document.querySelector("#output").innerHTML = ""
}