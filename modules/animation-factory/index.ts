import { World, Body } from "physics-worlds"
import { createShipCloseUp } from "./ship-close-up"



function createTestWorld2() {
    const world = new World([
        new Body({ x: 100, y: 100, size: 30, fillColor: 'red' })
    ], {
        width: 200,
        height: 200,
        fillColor: 'blue',
    })
    world.ticksPerSecond = 10
    return world
}

export { wanderingRoids } from "../asteroid-field/wanderingRoids"
export {
    createTestWorld2, createShipCloseUp,
}