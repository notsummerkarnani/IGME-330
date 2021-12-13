const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div class="section has-text-centered subtitle py-0">
    <div class="has-background-grey-dark has-text-white-ter py-6" id="footer-output">
        &copy; 2021 PlaceholderTitle || PlaceholderName || @PlaceholderEmail
    </div>
</div>
`;

class MyFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        this.render();
    }

    disconnectedCalbback() {}

    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes() {
        return ["data-title", "data-name", "data-email"];
    }

    render() {
        const title = this.getAttribute('data-title') ? this.getAttribute('data-title') : "IGME 330 Project 3";
        const name = this.getAttribute('data-name') ? this.getAttribute('data-name') : "Samar Karnani";
        const email = this.getAttribute('data-email') ? this.getAttribute('data-email') : "srk7473@rit.edu";

        this.shadowRoot.querySelector("#footer-output").innerHTML = `&copy; 2021 ${title} || ${name} || ${email}`
    }
}

customElements.define('my-footer', MyFooter)