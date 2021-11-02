'use strict';

let button = document.querySelectorAll("button");
button[0].onclick = () => {
    greeting("Hello")
};
button[1].onclick = () => {
    greeting("Goodbye")
};

function greeting(greeting) {
    document.getElementById("output").style.color = "red";
    let firstName = document.querySelector("#firstName").value;
    let lastName = document.querySelector("#lastName").value;
    if (firstName.length == 0) firstName = "default";
    if (lastName.length == 0) lastName = "default";
    document.querySelector("#output").innerHTML = `${greeting} ${firstName} ${lastName}`;
}