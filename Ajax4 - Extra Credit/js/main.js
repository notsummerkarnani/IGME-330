window.onload = loadJsonXHR;

document.querySelector("#filter").onfocus = changeForm;
document.querySelector("#filter").onchange = changeForm;

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

function changeForm(){
    arr = document.querySelectorAll(".output");
    for (let k of arr) {
        if (k.id != document.querySelector("#filter").value) {
            k.style.display = "none";
        }
        else{
            k.style.display = "block";
        }
    }
}