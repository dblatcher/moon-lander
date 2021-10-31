import { Body, BodyData } from "physics-worlds";

class Terrain extends Body {

    constructor(data: BodyData) {
        super(data)
        this.data.immobile = true
        this.data.elasticity = data.elasticity || .1
    }

    get typeId() { return "Terrain" }
}

export { Terrain }