class GameLogic {

    constructor(canvas, context, menu,loose,win) {
        this.context = context;
        this.context.font = "20px serif";
        this.canvas = canvas;
        this.menu = menu;
        this.loose = loose;
        this.win = win;

        this.hGround = 500;
        let groundShape = new Rectangle(-1000, this.hGround, 6000, 100);
        this.ground = new GameObject(groundShape, 0, 0.1, GMcondition.static, 0);
        let limitWall = new Rectangle(1000, -1000, 100, 1500);
        this.gmLimitWall = new GameObject(limitWall, 0, 0.1, GMcondition.static, 1);

        this.gameObject = new Array();
        this.gameObject.push(this.ground);
        this.gameObject.push(this.gmLimitWall);

        this.cannon = new Cannon(this.hGround);

        this.camera = new Camera(this.context);
        this.engine = new PhysicsEngine(this.gameObject, this.context);
        this.controleur = new GameControleur(this);

        this.lastLoop = performance.now();
        this.counter = 0;
        this.fps = 0;
        this.fpsMsg = "";
        this.showFPS = false;

    }

    updateGame() {
        if (this.isInGame) {
            this.clearContext();

            let objectToRemove = new Array();

            for (let i = 0; i < this.gameObject.length; i++) {
                this.gameObject[i].hasTakenDamage = false;
                if (this.gameObject[i].life_point == 0) {
                    if (this.gameObject[i] instanceof Target) {
                        this.nbTarget--;
                        this.score += this.gameObject[i].score;
                    }
                    objectToRemove.push(i);
                }
            }
            objectToRemove.forEach(i => {
                this.gameObject.splice(i, 1);
            });


            if (this.nbTarget == 0 && this.isInGame) {
                this.score += 5 * this.nbBall;
                //this.leftGame();
                this.isInGame = false;
                this.youWon(this.win);            
            }
            if (this.nbBall == 0 && this.nbTarget != 0 && this.isInGame) {

                //this.leftGame();
                this.isInGame = false;
                this.youLoose(this.loose,this.actualIdLevel);                
            }
            this.cannon.draw(this.context);

            this.engine.renderEngine();
            this.engine.applyPhysics();

            this.camera.continuousCamera();
            this.drawInfo(this.context, this.camera.coordCamera.x, this.camera.coordCamera.y);
        }
    }

    clearContext() {
        this.context.clearRect(0 - this.camera.coordCamera.x, 0 - this.camera.coordCamera.y, canvas.width, canvas.height);
    }

    enterLevel() {

        this.gameObject.push(this.ground);
        this.gameObject.push(this.gmLimitWall);
        

        this.controleur.gameLogic = this;
        this.controleur.gameObject = this.controleur.gameLogic.gameObject;

        this.isInGame = true;
        this.score = 0;
        this.canvas.style.display = "initial";
        this.menu.style.display = "none";
        this.loose.style.display = "none";
        this.win.style.display = "none";
    }

    leftGame() {
        let level = this.levelDescriptor["levelDesc"].splice(this.actualIdLevel - 1, 1);
        level[0]["score"] = this.score;
        this.levelDescriptor["levelDesc"].splice(this.actualIdLevel - 1, 0, level[0]);
        /*while (this.menu.firstChild) {
            this.menu.removeChild(this.menu.lastChild);
        }*/
        //this.createLevelMenu();


        this.gameObject = new Array();
        this.engine.gameObject = this.gameObject;
        this.controleur.gameLogic = this;        

        this.engine.restartEngine(this.gameObject);
        this.cannon = new Cannon(this.hGround);
        this.isInGame = false;
        this.canvas.style.display = "none";
    }

    createRectWall(descJsonWall, id) {
        let x = descJsonWall["x"];
        let y = descJsonWall["y"];
        let width = descJsonWall["width"];
        let height = descJsonWall["height"];
        let mass = descJsonWall["mass"];
        let restitution = descJsonWall["restitution"];
        let rect = new Rectangle(x, y, width, height);
        return new GameObject(rect, mass, restitution, GMcondition.awake, id, 100);
    }

    createTriangleWall(descJsonWall, id) {
        let x = descJsonWall["x"];
        let y = descJsonWall["y"];
        let base = descJsonWall["base"];
        let hauteur = descJsonWall["hauteur"];
        let mass = descJsonWall["mass"];
        let restitution = descJsonWall["restitution"];
        let tri = new Triangle(x, y, base, hauteur);
        return new GameObject(tri, mass, restitution, GMcondition.awake, id, 100);
    }

    createWall(descJsonWall, id) {
        let type = descJsonWall["type"];
        let res;
        if (type === "rectangle") {
            res = this.createRectWall(descJsonWall, id);
        }
        else if (type === "triangle") {
            res = this.createTriangleWall(descJsonWall, id);
        }
        return res;
    }

    createTarget(targetdescription, id) {
        let x = targetdescription["x"];
        let y = targetdescription["y"];
        let lpTarget = targetdescription["lp"];
        let radiusTarget = targetdescription["radius"];
        let score = targetdescription["score"];
        return new Target(id, lpTarget, score, x, y, radiusTarget);
    }

    newMenuButton(specificLevelDesc) {
        let newButton = document.createElement("button");
        newButton.setAttribute("id", specificLevelDesc["path"]);
        newButton.innerHTML = specificLevelDesc["levelName"];
        if (specificLevelDesc["score"] > 0) {
            newButton.innerHTML += " </br>Score : " + specificLevelDesc["score"];
        }
        newButton.disabled = !specificLevelDesc["resolue"];
        let mySelf = this;
        newButton.onclick = function () {
            mySelf.enterLevel();
            let levelName = newButton.id;
            let path = "level/" + levelName + "/desc.json";
            loadFromServer(path).then((value) => {
                mySelf.retryLevel = JSON.parse(value); 
                mySelf.nbBall = mySelf.retryLevel["nbBall"];
                let wall = mySelf.retryLevel["wall"];
                let target = mySelf.retryLevel["target"];
                mySelf.actualIdLevel = mySelf.retryLevel["idlevel"];
                let id = 3;
                mySelf.nbTarget = target.length;
                target.forEach(target => {
                    let newTarget = mySelf.createTarget(target, id);
                    mySelf.gameObject.push(newTarget);
                    ++id;
                });
                wall.forEach((wall) => {
                    let newWall = mySelf.createWall(wall, id);
                    mySelf.gameObject.push(newWall);
                    ++id;
                });
            });
        };
        this.menu.appendChild(newButton);
    }

    initLevelMenu() {
        loadFromServer("level/levelDescriptor.json").then((value) => {
            this.levelDescriptor = JSON.parse(value);
            this.levelDescriptor["levelDesc"].forEach((level) => {
                game_logic.newMenuButton(level);
            });
        });
    }

    createLevelMenu() {
        this.levelDescriptor["levelDesc"].forEach((level) => {
            game_logic.newMenuButton(level);
        });
    }

    youLoose(loose,level) {
        let mySelf=this;
        loose.setAttribute("style", "display: initial; position: absolute; top: 320px; left: 360px");
        this.context.strokeStyle = "#000000";
        this.context.fillStyle = "#000000";
        this.context.fillText("Tu as Perdu!", 400 - this.camera.coordCamera.x  , 240 - this.camera.coordCamera.y);
        this.context.fillText("Ton score : " + this.score, 400 - this.camera.coordCamera.x, 280 - this.camera.coordCamera.y);
        
        //Création d'un boutton
        let menuButton = document.createElement("button");
        menuButton.setAttribute("id", "BacktoMenu");
        menuButton.setAttribute("style", "2pt solid black; display: initial");
        menuButton.innerHTML = "Back to Menu";

        let retryButton = document.createElement("button");
        retryButton.setAttribute("id", "Retry");
        retryButton.setAttribute("style", "2pt solid black; display: initial");
        retryButton.innerHTML = "Retry";
        
        //Pas fini donc a ne pas prendre en compte.
        menuButton.onclick = function(){
            let remove = document.getElementById("Retry");
            let remove2 = document.getElementById("BacktoMenu");
            loose.removeChild(remove);
            loose.removeChild(remove2);            
            mySelf.leftGame();
            mySelf.menu.style.display = "initial";
            this.game_logic.creatLevelMenu();
        };

        //Ici l'action du boutton
        retryButton.onclick = function (){
            let remove = document.getElementById("Retry");
            let remove2 = document.getElementById("BacktoMenu");
            loose.removeChild(remove);
            loose.removeChild(remove2);            
            mySelf.leftGame();
            mySelf.enterLevel();
            mySelf.nbBall = mySelf.retryLevel["nbBall"];
            let wall = mySelf.retryLevel["wall"];
            let target = mySelf.retryLevel["target"];
            mySelf.actualIdLevel = mySelf.retryLevel["idlevel"];
            let id = 3;
            mySelf.nbTarget = target.length;
            target.forEach(target => {
                let newTarget = mySelf.createTarget(target, id);
                mySelf.gameObject.push(newTarget);
                ++id;
            });
            wall.forEach((wall) => {
                let newWall = mySelf.createWall(wall, id);
                mySelf.gameObject.push(newWall);
                ++id;
            });                                             
        };
        loose.append(menuButton);
        loose.append(retryButton);
    }

    youWon(win) {
        win.setAttribute("style", "display: initial" );
        win.setAttribute("position", "absolute" );    
        this.context.strokeStyle = "#000000";
        this.context.fillStyle = "#000000";
        this.context.fillText("Tu as Gagné!", 400 - this.camera.coordCamera.x, 240 - this.camera.coordCamera.y);
        this.context.fillText("Ton score : " + this.score, 400 - this.camera.coordCamera.x, 280 - this.camera.coordCamera.y);

        let menuButton = document.createElement("button");
        menuButton.setAttribute("id", "BacktoMenu");
        menuButton.setAttribute("style", "2pt solid black; display: initial");
        menuButton.innerHTML = "Back to Menu";

        let nextButton = document.createElement("button");
        nextButton.setAttribute("id", "NextLevel");
        nextButton.setAttribute("style", "2pt solid black; display: initial");
        nextButton.innerHTML = "Next Level";
        
        let niveau = this.actualIdLevel+1;
        let changeMenuButton = document.getElementById(niveau.toString());
        changeMenuButton.disabled = !specificLevelDesc["resolue"];

        menuButton.onclick = function(){
            game_logic.initLevelMenu();
        };

        nextButton.onclick = function (){            
            let mySelf = this;
            mySelf.enterLevel();
            let levelName = "level"+niveau.toString();
            let path = "level/" + levelName + "/desc.json";
            loadFromServer(path).then((value) => {
                let levelDesc = JSON.parse(value);
                mySelf.nbBall = levelDesc["nbBall"];
                let wall = levelDesc["wall"];
                let target = levelDesc["target"];
                mySelf.actualIdLevel = levelDesc["idlevel"];
                let id = 3;
                mySelf.nbTarget = target.length;
                target.forEach(target => {
                    let newTarget = mySelf.createTarget(target, id);
                    mySelf.gameObject.push(newTarget);
                    ++id;
                });
                wall.forEach((wall) => {
                    let newWall = mySelf.createWall(wall, id);
                    mySelf.gameObject.push(newWall);
                    ++id;
                });
            });
        };
        win.appendChild(menuButton);
        win.appendChild(nextButton);
    }

    /*
    Fonction permettant de calculer le framerate du canvas
    */
    fpsCounter(cameraX, cameraY) {
        this.counter += 1;
        let delta = (performance.now() - this.lastLoop) / 1000;
        this.lastLoop = performance.now();
        this.fps = Math.round(1 / delta);

        if (this.counter == 20) {
            this.fpsMsg = "fps : " + this.fps + ", time elapsed : " + delta * 1000 + " ms";
            this.counter = 0;
        }
        this.context.fillText(this.fpsMsg, 700 - cameraX, 560 - cameraY);
    }

    drawInfo(ctx, cameraX, cameraY) {

        var grd = ctx.createLinearGradient(10 - cameraX, 10 - cameraY, 10 - cameraX, (10 - cameraY) + 1 + ((this.cannon.powerCannon) * 2));
        grd.addColorStop(0, "red");
        grd.addColorStop(1, "green");
        ctx.fillStyle = grd;
        ctx.fillRect(10 - cameraX, 10 - cameraY, 20, 100);


        ctx.strokeStyle = "#000000";
        ctx.fillStyle = "#000000";
        ctx.fillText("puissance du canon : " + this.cannon.powerCannon, 10 - cameraX, 150 - cameraY);
        ctx.fillText("Nombre de Tir restant : " + this.nbBall, 40 - cameraX, 50 - cameraY);
        ctx.fillText("Nombre de cible restante : " + this.nbTarget, 40 - cameraX, 100 - cameraY);
        ctx.fillText("Score : " + this.score, 800 - cameraX, 50 - cameraY);

        if (this.showFPS) {
            this.fpsCounter(cameraX, cameraY);
        }

    }

    rotateCannon(angle) {
        for (let i = 0; i < this.cannon.shape.shapePoint.length; i++) {
            this.cannon.shape.shapePoint[i] = this.cannon.shape.shapePoint[i].rotatePoint(this.cannon.origin, angle);
        }
    }

}