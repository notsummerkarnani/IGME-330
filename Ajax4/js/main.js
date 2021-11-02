document.querySelector("#my-button").onclick = loadJsonXHR;

function loadJsonXHR() {
    const url = "data/pet-names.json";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
            const json = JSON.parse(e.target.responseText);
            if (!json) {
                document.querySelector("#output").innerHTML = "JSON is null!";
                return;
            }

            let html = "";
            for (let k of Object.keys(json)) {
                const obj = json[k];
                html += `<div class= "output"><h3>${obj.title}</h3>`
                html += `<ol>${obj.namelist.map(w=>`<li>${w}</li>`).join("")}</ol></div>`;
            }
            /* Bird Names taken From:
                https://be.chewy.com/top-10-pet-bird-names/
            */
            document.querySelector("#output").innerHTML = html; 
    };
            xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
            xhr.open("GET", url);
            xhr.send();
}