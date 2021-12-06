const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer"
/>
<nav class="navbar is-dark has-shadow">
    <!-- logo / brand -->
    <div class="navbar-brand">
        <a class="navbar-item" href="app.html">
            <i class="fas fa-search"></i>
        </a>
        <a class="navbar-burger" id="burger">
                <span></span>
                <span></span>
                <span></span>
        </a>
    </div>

    <div class="navbar-menu" id="nav-links">
        <div class="navbar-start">
            <a class="navbar-item is hoverable" href="home.html">Home</a>
            <a class="navbar-item is-hoverable" href="app.html">App</a>
            <a class="navbar-item is-hoverable" href="documentation.html">Documentation</a>
        </div>
    </div>
</nav>
`;

class MyNav extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.burgerIcon = this.shadowRoot.querySelector("#burger");
        this.navbarMenu = this.shadowRoot.querySelector("#nav-links");
        if (this.burgerIcon) this.burgerIcon.onclick = () => this.navbarMenu.classList.toggle('is-active');

        const navItems = this.navbarMenu.children[0].children;
        const thisPage = this.getAttribute('data-page') ? this.getAttribute('data-page') : "home";

        for (let k of Object.keys(navItems)) {
            if (navItems[k].href.split('/').slice(-1) == `${thisPage}.html`) {
                navItems[k].classList.add('has-background-warning')
                navItems[k].classList.add('has-text-black')
            }
        }
    }
}

customElements.define('my-nav', MyNav)