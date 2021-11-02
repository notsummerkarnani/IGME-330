import { loadFile, showMeal } from "./utils.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js";

const baseUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
let favData = {};

const firebaseConfig = {
    apiKey: "AIzaSyA5najtCFETKyyLonLLqOykSb7brw0e6Pk",
    authDomain: "igme330project2-f1633.firebaseapp.com",
    projectId: "igme330project2-f1633",
    storageBucket: "igme330project2-f1633.appspot.com",
    messagingSenderId: "1021022900143",
    appId: "1:1021022900143:web:6bba0fe0051ccacb5b295a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log(app); // make sure firebase is loaded


const db = getDatabase(); //entire db
const output = document.querySelector("#output"); //output element
const mealsRef = ref(db, 'Ratings'); //obj containing " meal.name: meal.likes " properties
let alreadyDeleted = [];
let biggest;
let top5 = {};

//called whenever the firebase db is updated
//adds liked data to array and then displays the top 5 meals
function mealsChanged(snapshot) {
    snapshot.forEach(meal => {
        const childKey = meal.key; //meal name
        const childData = meal.val(); //global likes for meal

        if (!biggest) biggest = childKey;

        favData[childKey] = childData;
    });

    sortTop();
    ShowData();
}

//Adds the top 5 favourites to top 5
function sortTop() {
    for (let i = 0; i < 5; i++) {
        getBiggest();
        top5[biggest] = favData[biggest]
        delete favData[biggest];
        alreadyDeleted.push(biggest);
    }
}

//Gets the most liked element from the data
function getBiggest() {
    for (let k of Object.keys(favData)) {
        if (favData[k] > favData[biggest] || alreadyDeleted.includes(biggest)) {
            //console.log(`smallest changed from ${biggest} to ${k}`)
            biggest = k;
        }
    }
    return biggest;
}

//Loops through top 5 and calls the API on each
function ShowData() {
    output.innerHTML = "";
    for (let k of Object.keys(top5)) {
        loadFile(baseUrl + k, jsonLoaded);
    }
    //console.log(top5);
}

const jsonLoaded = json => {
    for (let k of Object.keys(json.meals)) {
        const obj = json.meals[k];
        if (top5[obj.strMeal] != null) {
            output.innerHTML += `<hr><div class="title has-text-centered">Loved By:\t${top5[obj.strMeal]} users</div>`
        }
        showMeal(obj)
    };
}

//Assign events 
document.querySelector("#next5btn").onclick = e => {
    top5 = [];
    sortTop();
    ShowData();
}
document.querySelector("#prev5btn").onclick = e => location.reload();
onValue(mealsRef, mealsChanged);
//end of event assignment