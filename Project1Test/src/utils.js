const prefix = "srk7473-favourites";

const loadFile = (url, callback) => {
    const fetchPromise = async() => {
        const response = await fetch(url);
        callback(await response.json());
    }
    fetchPromise().catch(alert);
};

let favourites = []; //arr holding the favourites
loadFavourites();



//check if there is an object on localstorage 
//if it exists push it to the favourites array
function loadFavourites() {
    favourites = [];
    if (localStorage[prefix] != null) {
        let temp = JSON.parse(localStorage[prefix]);
        for (let k of Object.keys(temp)) {
            favourites.push(temp[k]);
        }
        return favourites;
    }
}

function showMeal(mcObj) {

    const mealCard = document.createElement("meal-card");

    if (!mcObj.strMeal) {
        mealCard.dataset.strMeal = "No Name found";
    } else {
        mealCard.dataset.strMeal = mcObj.strMeal;
    }

    if (!mcObj.strArea)
        mealCard.dataset.strArea = "Unknown";
    else {
        mealCard.dataset.strArea = mcObj.strArea;
    }

    if (!mcObj.strMealThumb)
        mealCard.dataset.strMealThumb = "";
    else {
        mealCard.dataset.strMealThumb = mcObj.strMealThumb;
    }

    if (!mcObj.strIngredients || !mcObj.strMeasurements) {
        let ingredients = [];
        let measurements = [];
        //format html for measure an ingrdients and send them as a string
        for (let i = 0; i < 20; i++) {
            if (!mcObj[`strIngredient${i+1}`] || !mcObj[`strMeasure${i+1}`]) {

            } else {
                ingredients.push(mcObj[`strIngredient${i+1}`]); // = `${mcObj[`strIngredient${i+1}`]}`;
                measurements.push(mcObj[`strMeasure${i+1}`]); // = `${mcObj[`strIngredient${i+1}`]}`;
                //mealCard.dataset[`strIngredient${i}`] = `${mcObj[`strIngredient${i+1}`]}`;
            }
        }
        mealCard.dataset.strIngredients = ingredients;
        mealCard.dataset.strMeasurements = measurements;
    } else {
        mealCard.dataset.strIngredients = mcObj.strIngredients;
        mealCard.dataset.strMeasurements = mcObj.strMeasurements;
    }

    if (!mcObj.strInstructions)
        mealCard.dataset.strInstructions = "";
    else {
        mealCard.dataset.strInstructions = mcObj.strInstructions;
    }

    if (!mcObj.strCategory)
        mealCard.dataset.strCategory = "";
    else {
        mealCard.dataset.strCategory = mcObj.strCategory;
    }

    if (!mcObj.strFavourite)
        mealCard.dataset.strFavourite = "false";
    else {
        mealCard.dataset.strFavourite = mcObj.strFavourite;
    }

    //check if meal is already in favourites 
    if (favourites.length > 0) {
        if (favourites.filter(element => element.strMeal == mcObj.strMeal).length > 0) {
            mealCard.dataset.strFavourite = "true";
        }
    }

    return document.querySelector("#output").appendChild(mealCard);
}

//param is the dataset of the obj to add
//Checks if card is already there, if not adds it and updates localstorage
function addfavourite(card) {
    if (!card) { return; }

    if (favourites.length > 0) {
        if (favourites.filter(element => element.strMeal == card.strMeal).length > 0) {
            return;
        }
        favourites.push(card);
        localStorage.setItem(prefix, JSON.stringify(favourites));
        return;
    }
    favourites.push(card);
    localStorage.setItem(prefix, JSON.stringify(favourites));
}

//param is the dataset of the obj to remove
//Checks if card is there, if yes removes it and updates localstorage
function removefavourite(card) {

    if (!card) { return; }

    if (favourites.length > 0) {
        let match = favourites.filter(element => element.strMeal == card.strMeal);
        if (match.length > 0) {
            favourites.splice(favourites.indexOf(match[0]), 1);
            localStorage.setItem(prefix, JSON.stringify(favourites));
        }
    }
}

export { loadFile, showMeal, addfavourite, removefavourite, loadFavourites };