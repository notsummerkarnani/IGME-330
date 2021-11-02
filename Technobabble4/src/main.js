"use strict";

let words1, words2, words3;

window.onload = loadTextXHR;

function loadTextXHR() {
    const url = "data/words.csv";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        const text = e.target.responseText;
        [words1, words2, words3] = text.split("\n");
        words1 = words1.split(",");
        words2 = words2.split(",");
        words3 = words3.split(",");
        generate(1);
        document.querySelector("#myButton").addEventListener("click", () => { generate(1) });
        document.querySelector("#myButton1").addEventListener("click", () => { generate(5) });
    };
    xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
    xhr.open("GET", url);
    xhr.send();
    console.log("Run");
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
    //console.log(str);
}