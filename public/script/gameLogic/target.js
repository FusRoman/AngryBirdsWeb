class Target extends GameObject {

    constructor(mass, restitution, condition, id, life_point, pos_x,pos_y, radius){
        let shape=new Circle(pos_x,pos_y,radius);
        super(shape, mass, restitution, condition, id, life_point);
    }

}