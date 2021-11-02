import { addfavourite } from "../src/utils.js"
import { removefavourite } from "../src/utils.js"

const template = document.createElement("template");
template.innerHTML = `
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.3/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w==" crossorigin="anonymous" referrerpolicy="no-referrer"/>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Grechen+Fuemen&display=swap" rel="stylesheet">
<style>
img {
  max-width: 240px;
}
</style>
<div class="container p-3 has-background-primary is-centered">
  <div class="columns is-centered">
    <div class="column is-centered">
      <img class="image is-1by1 is-pulled-right p-1" id="image" src="" alt="No Image">
      <div class="title columns level">
        <div class="column" id="title">
          Placeholder Title
        </div>
        <div class="button column" id="fav-button">
          <i class="far fa-heart"></i>
        </div>
      </div>
      <div class="columns subtitle" id="subtitle"> Placeholder subtitle </div>
      <div class="content" id="instructions"></div>
    </div>  
      
    <div class="column is-narrow">
      <table class="table">
        <thead>
          <tr>
            <th>Measure</th>
            <th>Ingredient</th>
          </tr>
        </thead>
        <tbody id="tablebody">
          <tr>
            <td>Placeholder Measure</td>
            <td>Placeholder Ingredient</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
<br>
`;

class MealCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.myTitle = this.shadowRoot.querySelector("#title");
        this.mySubtitle = this.shadowRoot.querySelector("#subtitle");
        this.myFavButton = this.shadowRoot.querySelector("#fav-button");
        this.myImage = this.shadowRoot.querySelector("#image");
        this.myTableBody = this.shadowRoot.querySelector("#tablebody");
        this.myInstructions = this.shadowRoot.querySelector("#instructions");
        this.isFavourite = this.getAttribute('data-str-favourite') ? this.getAttribute('data-str-favourite') : "false";
    }

    connectedCallback() {
        this.myFavButton.onclick = () => {
            if (this.isFavourite == "true") {
                this.setAttribute('data-str-favourite', "false");
                removefavourite(this.dataset);
            } else {
                this.setAttribute('data-str-favourite', "true");
                addfavourite(this.dataset);
            }
            this.render();
        };
    }

    disconnectedCallback() {
        this.myFavButton.onclick = null;
    }

    attributeChangedCallback(attributeName, oldVal, newVal) {
        //console.log(attributeName, oldVal, newVal);
        this.render();
    }

    static get observedAttributes() {
        return ["data-str-meal", "data-str-area", "data-str-meal-thumb", "data-str-ingredients", "data-str-measurements", "data-str-instructions", "data-str-category", "data-str-favourite"];
    }

    render() {
        const name = this.getAttribute('data-str-meal') ? this.getAttribute('data-str-meal') : "No name found";
        const area = this.getAttribute('data-str-area') ? this.getAttribute('data-str-area') : "No area info";
        const imageURL = this.getAttribute('data-str-meal-thumb') ? this.getAttribute('data-str-meal-thumb') : "";
        let ingredients = this.getAttribute('data-str-ingredients') ? this.getAttribute('data-str-ingredients') : "No ingredients found";
        let measurements = this.getAttribute('data-str-measurements') ? this.getAttribute('data-str-measurements') : "No measurements found";
        let instructions = this.getAttribute('data-str-instructions') ? this.getAttribute('data-str-instructions') : "No instructions found";
        let category = this.getAttribute('data-str-category') ? this.getAttribute('data-str-category') : "No category found";
        this.isFavourite = this.getAttribute('data-str-favourite') // ? this.getAttribute('data-str-favourite')

        this.myTitle.innerHTML = `${name}`;
        this.mySubtitle.innerHTML = `<p class="column">Cuisine: ${area}</p><p class="column">Category: ${category}</p>`;
        this.myImage.src = imageURL;

        if (this.isFavourite == "true") {
            this.myFavButton.innerHTML = `<i class="fas fa-heart"></i>`;
        } else {
            this.myFavButton.innerHTML = `<i class="far fa-heart"></i>`;
        }

        let temp = "";
        measurements = measurements.split(',');
        ingredients = ingredients.split(',')
        for (let i = 0; i < measurements.length; i++) {
            if (measurements[i] != "" && ingredients[i] != "")
                temp += `<tr><td>${measurements[i]}</td><td>${ingredients[i]}</td></tr>`;

        }
        this.myTableBody.innerHTML = temp

        temp = "";
        instructions.split('.').forEach(element => {
            if (element != "")
                temp += `<li>${element}</li>`
        })
        this.myInstructions.innerHTML = `<ul>${temp}</ul>`;

    }
}

customElements.define('meal-card', MealCard);