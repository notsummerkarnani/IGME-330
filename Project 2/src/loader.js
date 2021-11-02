// Because every P1 page will link to this script,
// it's a great place to load your components! 
import "../components/meal-card.js";
import "../components/my-footer.js";
import "../components/my-nav.js";

const burgerIcon = document.querySelector("#burger");
const navbarMenu = document.querySelector("#nav-links");
if (burgerIcon) burgerIcon.onclick = () => navbarMenu.classList.toggle('is-active');