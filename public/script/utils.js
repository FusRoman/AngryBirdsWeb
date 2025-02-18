function randomIntervalle(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function loadFromServer(url) {

    return new Promise((success, failure) => {

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function () {
            if (this.readyState == 4) {
                if (this.status == 200)
                    success(this.responseText);
                else
                    failure(this.status + " : " + this.responseText);
            }
        });

        let path = "/ressource/";
        xhr.open("GET", path + url);
        xhr.send();
    });

}