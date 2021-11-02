import { loadFile, showMeal } from "./utils.js";

const bannerType = {
    nulljson: "No resuls found!",
    emptysearchbar: "Please enter a valid input into the search field!",
    numresults: "Number of results found: ",
};

const baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

let mcJSON = []; //array holding all json ojects returned
let cuisines = []; //array holding cuisines displayed in the dropdown
let categories = []; //categories currently held in the dropdown
let lastSearch = {}; //holds the last search by the user

//assign html element accessors
let numberSelect = document.querySelector("#number-select");
let searchButton = document.querySelector("#btn-search");
let countryDropdown = document.querySelector("#country-select");
let categoryDropdown = document.querySelector("#category-select");
let output = document.querySelector("#output");
let searchBar = document.querySelector("#input-search-bar");
//end of assigbment 

//Assign functions to Event Handlers
numberSelect.onchange = resetOutput;
categoryDropdown.onchange = resetOutput;
countryDropdown.onchange = resetOutput;
searchButton.onclick = Search;
//end of assignment



const jsonLoaded = json => {
    if (json.meals == null || json == null) {
        showBanner('is-warning', bannerType.nulljson);
        return;
    }

    for (let k of Object.keys(json.meals)) {
        const obj = json.meals[k];
        mcJSON.push(obj);
        if (!categories.includes(obj.strCategory)) {
            categoryDropdown.innerHTML += `<option>${obj.strCategory}</option>`;
            categories.push(obj.strCategory);
        }
        if (!cuisines.includes(obj.strArea)) {
            countryDropdown.innerHTML += `<option>${obj.strArea}</option>`;
            cuisines.push(obj.strArea);
        }
    }
    resetOutput();
}

function resetOutput() {
    output.innerHTML = "";
    showBanner('is-warning', bannerType.numresults + mcJSON.length);
    let i = 0;

    mcJSON.forEach(element => {
        //check if item number is less than what the user asked for
        //check if category of element matches dropdown or no filter is selected
        //check if cuisine of element matches dropdown or no filter is selected
        if (i < numberSelect.value &&
            (element.strArea == countryDropdown.value || countryDropdown.value == "All") &&
            (element.strCategory == categoryDropdown.value || categoryDropdown.value == "All")) {
            showMeal(element);
            i++
        }
    });
    searchButton.classList.remove("is-loading");
}

function Search() {
    //Add Spinner to button
    searchButton.classList.add("is-loading");

    //reset json list and output html
    mcJSON = [];
    output.innerHTML = "";

    //Checks if searchbar is red and removes if yes 
    if (searchBar.classList.contains('is-danger')) {
        searchBar.classList.remove("is-danger");
    }

    //checks for null input and displays error message
    if (searchBar.value.length == 0) {
        showBanner('is-danger', bannerType.emptysearchbar);
        return;
    }

    lastSearch.name = searchBar.value;
    lastSearch.number = numberSelect.value
    lastSearch.category = categoryDropdown.value
    lastSearch.country = countryDropdown.value
    localStorage.setItem("srk7473-lastsearch", JSON.stringify(lastSearch));

    loadFile(baseUrl + searchBar.value, jsonLoaded);
}


//param type of banner being shown
//displays message on the screen
function showBanner(colour, message) {
    searchButton.classList.remove('is-loading');
    output.innerHTML += `<div class="container notification title ${colour}">${message}</div>`;
}


//check localstorage for saved search data and display it
let obj
try {
    obj = JSON.parse(localStorage["srk7473-lastsearch"]);
} catch (error) {
    console.log(error);
    obj = { name: "Pizza", number: 1, country: "All", category: "All" }
}
searchBar.value = obj.name;
numberSelect.value = obj.number;
countryDropdown.value = obj.country;
categoryDropdown.value = obj.category;
Search();
//loadFile(baseUrl, jsonLoaded);