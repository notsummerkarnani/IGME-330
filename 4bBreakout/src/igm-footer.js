const template = document.createElement("template");
template.innerHTML = `
<style>
:host{
    display: block;
    background-color: #ddd;
    user-select: none;
}
h1{
    color: #F76902;
    font-variant: small-caps;
    font-weight: bolder;
    font-family: sans-serif;
}
hr{
    border: 3px solid red;
  }
</style>
<span>
<h1 id="title">Counter</h1>
<button id="minus">-</button>
<button id="plus">+</button>
<h2 id="output"></h2>
</span>`;

class Counter extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        // put this at the end of the constructor
        if (!this.dataset.title) this.dataset.title = "My Counter";
        if (!this.dataset.count || !Number(this.dataset.count)) this.dataset.count = 0;
        if (!this.dataset.max || !Number(this.dataset.max)) this.dataset.max = 100;
        if (!this.dataset.min || !Number(this.dataset.min)) this.dataset.min = 0;

        // This line of code will create an property named `span` for us, so that we don't have to keep calling this.shadowRoot.querySelector("span");
        this.plus = this.shadowRoot.querySelector("#plus");
        this.minus = this.shadowRoot.querySelector("#minus");
    };


    connectedCallback() {
        this.render();
        this.plus.onclick = () => {
            if (this.dataset.count < this.dataset.max) {
                const temp = +this.dataset.count + 1;
                this.dataset.count = temp;
            } else {
                console.log("Max value reached");
            }
        }
        this.minus.onclick = () => {
            if (this.dataset.count > this.dataset.min) {
                this.dataset.count--;
            } else {
                console.log("Min value reached");
            }
        }
    }

    disconnectedCallback() {
        this.plus.onclick = null;
        this.minus.onclick = null;
    }

    static get observedAttributes() {
        return ["data-title", "data-count", "data-max", "data-min"];
    }


    attributeChangedCallback(attributeName, oldVal, newVal) {
        this.render();
    }

    render() {
        const count = this.dataset.count ? this.dataset.count : "0";
        const title = this.dataset.title ? this.dataset.title : "My Counter";
        this.shadowRoot.querySelector("#output").innerHTML = `Count:  ${count}`;
        this.shadowRoot.querySelector("#title").innerHTML = `${title}`
    }
}

customElements.define('counter-box', Counter);