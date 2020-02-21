function loadFromServer(url){

    return new Promise((success, failure) =>{

        let xhr = new XMLHttpRequest();

        xhr.addEventListener("readystatechange", function(){
            if (this.readyState == 4) {
                if (this.status == 200)
                    success(this.responseText);
                else
                    failure(this.status + " : " + this.responseText);
            }
        });

        let path = "http://localhost:8000/ressource/";
        xhr.open("GET", path + url);
        xhr.send();
    });

}