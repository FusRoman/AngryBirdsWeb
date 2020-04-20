class GameLogic {

    constructor(canvas, context, menu) {
        this.context = context;
        this.context.font = "20px serif";
        this.canvas = canvas;
        this.menu = menu;

        this.leftGame();

        this.hGround = 500;
        let groundShape = new Rectangle(-1000, this.hGround, 6000, 100);
        this.ground = new GameObject(groundShape, 0, 0.1, GMcondition.static, 0);
        let limitWall = new Rectangle(1000, -1000, 100, 1500);
        this.gmLimitWall = new GameObject(limitWall, 0, 0.1, GMcondition.static, 1);

        this.gameObject = new Array();
        this.gameObject.push(this.ground);
        this.gameObject.push(this.gmLimitWall);

        this.engine = new PhysicsEngine(this.gameObject, this.context);
        this.controleur = new GameControleur(this);


        this.camera = new Camera(this.context);
        this.cannon = new Cannon(this.hGround);

        this.score = 0;

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


            if (this.nbTarget == 0) {
                //this.score = this.score + 500 * this.nbShoot;
                this.youWon();
            }
            if (this.nbShoot == 0 && this.nbTarget != 0) {
                this.youLoose();
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
        this.isInGame = true;
        this.canvas.style.display = "initial";
        this.menu.style.display = "none";
    }

    leftGame() {
        this.isInGame = false;
        this.canvas.style.display = "none";
        this.menu.style.display = "initial";
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

    newMenuButton(menu, specificLevelDesc) {
        let newButton = document.createElement("button");
        newButton.setAttribute("id", specificLevelDesc["path"]);
        newButton.innerHTML = specificLevelDesc["levelName"];
        if (specificLevelDesc["score"] > 0) {
            newButton.innerHTML += " </br>Score : " + specificLevelDesc["score"];
        }
        newButton.disabled = !specificLevelDesc["resolue"];
        let mySelf = this;
        newButton.onclick = function () {
            let levelName = newButton.id;
            let path = "level/" + levelName + "/desc.json";
            loadFromServer(path).then((value) => {
                let levelDesc = JSON.parse(value);
                let wall = levelDesc["wall"];
                let target = levelDesc["target"];
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
            mySelf.enterLevel();
        };
        menu.appendChild(newButton);
    }

    createLevelMenu() {
        loadFromServer("level/levelDescriptor.json").then((value) => {
            this.levelDescriptor = JSON.parse(value);
            this.levelDescriptor["levelDesc"].forEach((level) => {
                game_logic.newMenuButton(menu, level);
            });
        });
    }

    youLoose() {
        return this.score;
    }

    youWon() {
        return this.score;
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
        ctx.fillText("Nombre de Tir restant : " + this.nbShoot, 40 - cameraX, 50 - cameraY);
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