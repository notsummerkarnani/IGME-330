window.onload = loadJsonFetch;
document.querySelector("#filter").onfocus = changeForm;
document.querySelector("#filter").onchange = changeForm;

function loadJsonFetch() {
    fetch('data/pet-names.json') // get a Star Wars character
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            //else
            return response.text().then(text => { throw text; });
        })
        .then(json => {
                let html = "";
                for (let k of Object.keys(json)) {
                    const obj = json[k];
                    document.querySelector("#filter").innerHTML += `<option value="${obj.type}">${obj.title}</option>`
                    html += `<div class= "output" id="${obj.type}"><h3>${obj.title}</h3>`
                    html += `<ol>${obj.namelist.map(w=>`<li>${w}</li>`).join("")}</ol></div>`;
            }
            document.querySelector("#output").innerHTML = html; 
            changeForm();
        }).catch(error => {
            //error
            document.querySelector("#output").innerHTML = "JSON is null!";
            return;
        });

}

function changeForm() {
    let filter = document.querySelector("#filter").value
    arr = document.querySelectorAll(".output");
    for (let k of arr) {
        if (filter != "all" && k.id != filter) {
            k.style.display = "none";
        } else {
            k.style.display = "block";
        }
    }
}

/*
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
                document.querySelector("#filter").innerHTML += `<option value="${obj.type}">${obj.title}</option>`

                html += `<div class= "output" id="${obj.type}"><h3>${obj.title}</h3>`
                html += `<ol>${obj.namelist.map(w=>`<li>${w}</li>`).join("")}</ol></div>`;
            }
            document.querySelector("#output").innerHTML = html; 
            changeForm();
    };
            xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
            xhr.open("GET", url);
            xhr.send();
}

function loadJsonFetch() {
    const promise = fetch('https://swapi.dev/api/people/1'); // get a Star Wars character
    console.log(promise); // "Promise {<pending>}"
}

function loadJsonFetch() {
    fetch('https://swapi.dev/api/people/1') // get a Star Wars character
        .then(response => {
            //success
            console.log(response);
            console.log(response.json());
        }).catch(error => {
            //error
            console.log(error);
        });

}
*/