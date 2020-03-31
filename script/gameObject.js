class GameObject {

    constructor(shape, mass) {
        this.shape = shape // rigid body object
        this.speed = new Vector2D(0, 0); // velocity vector
        this.acc = new Vector2D(0, 0); // acceleration vector
        //this.theta = new Vector2D(thetaX, thetaY); // orientation
        //this.omega = new Vector2D(omegaX, omegaY); // velocity angular
        //this.alpha = new Vector2D(alphaX, alphaY); // angular acceleration
        this.mass = mass;

        if (mass == 0) {
            /* on represente une masse infinie comme une masse valant 0.
               Pour éviter les divisions par 0, on considère que la masse
               inverse vaut 0 */
            this.invMass = 0;
        }
        else {
            this.invMass = 1 / mass;
        }
    }

    draw(context){
        this.shape.draw(context);
    }

    /*
        ajoute une nouvelle force aux objets 
    */
    addForce(new_force){
        this.force.push(new_force);
    }

    /*
        Calcul de la seconde loi de Newton : sum(forces) = m * a
    */
    computeSecondLawNewton(force){
        let sumForce = new Vector2D(0, 0);
        force.forEach(element => {
            sumForce = sumForce.add(element);
        });
        return sumForce;
    }

    /*
        Nous utilisons la methodes d'integration de la vitesse de Verlet
    */
    updatePos(timeStep) {
        let withSpeed = this.speed.mul(timeStep);
        let withAcc = this.acc.mul(0.5).mul(timeStep * timeStep);
        let newPos = withSpeed.add(withAcc);
        for(let i = 0; i < this.shape.shapePoint.length; i++){
            this.shape.shapePoint[i] = this.shape.shapePoint[i].add(newPos);
        }
    }

    updateSpeed(timeStep) {
        this.speed = this.speed.add(this.acc.mul(timeStep));
    }

    updateAcc(force) {
        let somme_force = this.computeSecondLawNewton(force);
        somme_force = somme_force.mul(this.invMass);
        this.acc = this.acc.add(somme_force).div(2);
    }

    applyKineticLawOfmotion(timeStep, force){
        this.updateAcc(force);
        this.updateSpeed(timeStep);
        this.updatePos(timeStep);
    }
}