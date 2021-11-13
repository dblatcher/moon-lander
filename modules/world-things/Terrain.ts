import { Body, BodyData } from "physics-worlds";

class Terrain extends Body {

    constructor(data: BodyData) {
        const elasticity = data.elasticity || Terrain.DEFAULT_ELASTICITY;
        super(data)
        this.data.immobile = true
        this.data.elasticity = elasticity;
    }

    static DEFAULT_ELASTICITY = .1
    get typeId() { return "Terrain" }
}

export { Terrain }