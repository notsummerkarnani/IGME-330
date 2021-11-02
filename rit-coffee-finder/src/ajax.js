function dowloadFile(url, callbackRef) {

    const xhr = new XMLHttpRequest();

    xhr.onerror = (e) => console.log(e);

    xhr.onload = (e) => {
        const headers = e.target.getAllResponseHeaders();
        const jsonString = e.target.response;

        //console.log(`Headers = ${headers}`);
        //console.log(`JSON string = ${jsonString}`);
        callbackRef(jsonString);
    };
    xhr.open("GET", url);
    xhr.send();
}

export { dowloadFile };