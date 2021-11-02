"use strict";

let words1, words2, words3;

init();

function init() {
    loadXMLXHR();
    generate();
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

function loadXMLXHR() {
    const url = "data/words.xml";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
        const xml = e.target.responseXML;
        if (!xml) {
            document.querySelector("#output").innerHTML = "XML is null!";
            return;
        }
        words1 = xml.querySelector("namelist[cid='words1']").textContent.split(",");
        words2 = xml.querySelector("namelist[cid='words2']").textContent.split(",");
        words3 = xml.querySelector("namelist[cid='words3']").textContent.split(",");
    };
    xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
    xhr.open("GET", url);
    xhr.send();
}