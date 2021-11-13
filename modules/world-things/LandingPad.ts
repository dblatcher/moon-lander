import { BodyData } from "physics-worlds";
import { Terrain } from "./Terrain";

class LandingPad extends Terrain {

    constructor(data: BodyData) {
        const elasticity = data.elasticity || LandingPad.DEFAULT_ELASTICITY;
        super(data)
        this.data.immobile = true
        this.data.elasticity = elasticity;
    }

    static DEFAULT_ELASTICITY = .3
    get typeId() { return "LandingPad" }
}

export { LandingPad }