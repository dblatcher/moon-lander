import { Body, BodyData } from "physics-worlds";

class LandingPad extends Body {

    constructor(data: BodyData) {
        super(data)
        this.data.immobile = true
    }

    get typeId() { return "LandingPad" }
}

export { LandingPad }