const GMcondition = Object.freeze({ "awake": 1, "sleeping": 2, "static": 3 });


class GameObject extends Dynamics {


    // Attention, l'id 0 est reservé au sol et l'id 1 au boulet de cannon
    constructor(shape, mass, restitution, condition, id) {

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
        this.shape = shape // rigid body object

    }

    equal(gm) {
        return this.id == gm.id;
    }

    draw(context) {
        context.strokeStyle = "#000000";
        this.shape.draw(context);
    }

}