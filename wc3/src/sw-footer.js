const template = document.createElement("template");
template.innerHTML = `
<style>
footer{
    color: white;
    background-color: black;
    padding: .5em;
    user-select: none;
    margin-bottom: .5rem;
  }
</style>
<footer>
    &copy; 2021 Samar Karnani
</footer>
`;

class SWFooter extends HTMLElement {
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
        return [];
    }

    render() {}
}

customElements.define('sw-footer', SWFooter)