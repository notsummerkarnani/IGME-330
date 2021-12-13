const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<div id="banner-container" class="container notification title">
    <p id="end-button" class="button is-pulled-right">X</p>
    <p class="content" id="banner-output">
        Placeholder content
    </p>
</div>
`;

class MyBanner extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.endButton = this.shadowRoot.querySelector('#end-button');
        this.colourList = this.shadowRoot.querySelector("#banner-container");
        this.myOutput = this.shadowRoot.querySelector("#banner-output");
    }

    connectedCallback() {
        this.endButton.onclick = () => {
            this.remove();
        }
    }

    disconnectedCalbback() {
        this.endButton.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        console.log(attributeName, oldVal, newVal);

        const text = this.getAttribute('data-text') ? this.getAttribute('data-text') : "Placeholder Text";
        const colour = this.getAttribute('data-colour') ? this.getAttribute('data-colour') : " is-warning";

        this.colourList.classList += " " + colour;
        this.myOutput.innerHTML = text;

    }

    static get observedAttributes() {
        return ["data-text", "data-colour"];
    }

}

customElements.define('my-banner', MyBanner)