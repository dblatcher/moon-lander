import { Body, BodyData } from "physics-worlds";

class LandingPad extends Body {

    constructor(data: BodyData) {
        super(data)
        this.data.immobile = true
        this.data.elasticity = data.elasticity || .1
    }

    get typeId() { return "LandingPad" }
}

export { LandingPad }