import { Body, BodyData } from "physics-worlds";

class Terrain extends Body {

    constructor(data: BodyData) {
        super(data)
        this.data.immobile = true
    }

    get typeId() { return "Terrain" }
}

export { Terrain }