document.querySelector("#my-button").onclick = loadTextXHR;

function loadTextXHR() {
    const url = "data/pet-names.csv";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
            const text = e.target.responseText;
            let [dogNames, catNames, birdNames] = text.split("\n");
            dogNames = dogNames.split(",");
            catNames = catNames.split(",");
            birdNames = birdNames.split(",");

            /* Bird Names taken From:
                https://be.chewy.com/top-10-pet-bird-names/
            */

            const doghtml = `<ol>${dogNames.map(w=>`<li>${w}</li>`).join("")}</ol>`;
            const cathtml = `<ol>${catNames.map(w=>`<li>${w}</li>`).join("")}</ol>`;
            const birdhtml = `<ol>${birdNames.map(w=>`<li>${w}</li>`).join("")}</ol>`;

             const html = `<div class= "output"><h3>Dog Names</h3>${doghtml}</div><div class= "output"><h3>Cat Names</h3>${cathtml}</div><div class= "output"><h3>Bird Names</h3>${birdhtml}</div>`;

            document.querySelector("#output").innerHTML = html; 
    };
            xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
            xhr.open("GET", url);
            xhr.send();
}