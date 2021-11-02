document.querySelector("#my-button").onclick = loadTextXHR;

function loadTextXHR() {
    const url = "data/pet-names.txt";
    const xhr = new XMLHttpRequest();
    xhr.onload = (e) => {
            //console.log(`In onload - HTTP Status Code = ${e.target.status}`)
            const text = e.target.responseText;
            //console.log(`Success! The file length is ${text.length}`);
            const words = text.split(",");
            const html = `<ol>${words.map(w=>`<li>${w}</li>`).join("")}</ol>`;
            document.querySelector("#output").innerHTML = html; 
    };
            xhr.onerror = e => console.log(`In onerror - HTTP Status code = ${e.target.status}`)
            xhr.open("GET", url);
            xhr.send();
}