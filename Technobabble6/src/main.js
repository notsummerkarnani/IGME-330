"use strict";

let words1, words2, words3;

window.onload = init;

function init() {
    loadJsonXHR();
    document.querySelector("#myButton").addEventListener("click", () => { generate(1) });
    document.querySelector("#myButton1").addEventListener("click", () => { generate(5) });
}

function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function generate(number) {
    let str = "";
    for (let i = 0; i < number; i++) {
        str += `${randomElement(words1)} ${randomElement(words2)} ${randomElement(words3)} <br>`;
    }
    document.querySelector("#output").innerHTML = str;
}

function loadJsonXHR() {
    const url = "data/words.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        const json = JSON.parse(e.target.responseText);
        console.log(json)
        if (!json) {
            document.querySelector("#output").innerHTML = "JSON is null!";
            return;
        }
        [words1, words2, words3] = [json[0].namelist, json[1].namelist, json[2].namelist];
        generate(1);
    };
    xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
    xhr.open("GET", url);
    xhr.send();
}