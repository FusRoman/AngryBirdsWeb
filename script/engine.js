class Engine {

    /*
        Automate du moteur physique :

            1: Affichage des objets
            2: Calcul des nouvelles positions
            3: Detection des collisions
            4: Calcul d'une réponse au collision
            5: Mise à jour de l'état des objets
            Retour en 1 (cycle)
    */

    constructor(timeStep, gameObjectList){
        this.timeStep = timeStep;
        this.gameObjectList = gameObjectList
    }

    updateTime(){
        this.timeStep += 1;
    }

}