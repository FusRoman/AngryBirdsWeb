class Level{

    constructor(levelName){
        this.levelName = levelName;
    }

    getLevel(){
        return new Promise((success, failure) => {

            let xhr = new XMLHttpRequest();

            xhr.addEventListener("readystatechange", function(){
                if (this.readyState == 4) {
                    if (this.status == 200)
                        success(this.responseText);
                    else
                        failure(this.status + " : " + this.responseText);
                }
            });

            let pathLevelFile = "http://localhost:8000/ressource/level/" + this.levelName;

            xhr.open("GET", pathLevelFile);
            //xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xhr.send();

        }).then((value) => {
            console.log(value);
            return JSON.parse(value);
        });
    }

}