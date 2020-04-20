const GMcondition = Object.freeze({ "awake": 1, "sleeping": 2, "static": 3 });


class GameObject extends Dynamics {

    //Id 0 is reserved by the ground, id 1 by the limitWall and id 2 by the cannon ball
    constructor(shape, mass, restitution, condition, id, life_point) {

        /*let inertialMoment = -1;
        if (shape instanceof Rectangle) {
            inertialMoment = (1 / 12) * mass * ((shape.width * shape.width) * (shape.heigth * shape.heigth));
        }
        if (shape instanceof Triangle) {
            inertialMoment = shape.base * (shape.hauteur * shape.hauteur * shape.hauteur) * (1 / 12);
        }
        if (shape instanceof Circle) {
            inertialMoment = Math.PI * (shape.diameter * shape.diameter * shape.diameter * shape.diameter) * (1 / 64);
        }*/

        super(shape, new Vector2D(0, 0), new Vector2D(0, 0), /*0, 0,*/ mass, restitution, /*inertialMoment,*/ condition);


        this.id = id; // id of the gameObject, must be unique for each gameObject to perform the equal method
        this.shape = shape; // rigid body object
        this.life_point = life_point; // Life point of any object except cannon ball

        this.hasTakenDamage = false;

    }

    updateLifePoint(damage) {
        if (this.life_point - damage <= 0) {
            this.life_point = 0;
        }
        else {
            this.life_point -= damage;
        }
    }

    takeDamage(damage) {
        this.updateLifePoint(damage);
        this.hasTakenDamage = true;
    }

    equal(gm) {
        return this.id == gm.id;
    }

    draw(context) {
        if (this.condition === GMcondition.awake) {
            let red = 255 - (255 * (this.life_point / 100));
            let green = 255 * (this.life_point / 100);
            context.fillStyle = "rgb(" + red + ", " + green + ", 0)";
            context.strokeStyle = "#000000";
            this.shape.draw(context);
        }
        else{
            context.fillStyle = "#ffffff";
            context.strokeStyle = "#000000";
            this.shape.draw(context);
        }
    }

}