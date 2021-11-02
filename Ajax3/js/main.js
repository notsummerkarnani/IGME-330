document.querySelector("#my-button").onclick = loadXMLXHR;

function loadXMLXHR() {
    const url = "data/pet-names.xml";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
            const xml = e.target.responseXML;
            if (!xml) {
                document.querySelector("#output").innerHTML = "XML is null!";
                return;
            }
            const dogNames = xml.querySelector("namelist[cid='dognames']").textContent.split(",");
            const catNames = xml.querySelector("namelist[cid='catnames']").textContent.split(",");
            birdNames = xml.querySelector("namelist[cid='birdnames']").textContent.split(",");

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