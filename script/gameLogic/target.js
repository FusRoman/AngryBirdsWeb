class Target extends GameObject {

    constructor(mass, restitution, condition, id,pos_x,pos_y,radius,life_point){
        let shape=new Circle(pos_x,pos_y,radius);
        super(shape, mass, restitution, condition, id);
        this.life_point=life_point;
    }

    updateLifePoint(){
        if(){

        }
    }

}