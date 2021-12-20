import { Area, Geometry, StarField, World } from "physics-worlds"
import { atmosphere } from "../level-factory/fills"
import { SpaceShip } from "../world-things/SpaceShip"

function createShipCloseUp() {
    const world = new World([
        new SpaceShip({
            x: 100, y: 100, size: 25,
            fillColor: 'white',
            heading: Geometry._deg * (135),
            thrust: 100, maxThrust: 200,
            immobile: true
        }),
        new Area({
            x: -50,
            y: 200,
            fillColor: atmosphere,
            size: 125,
            density: .2
        }),
    ], {
        width: 220,
        height: 220,
        fillColor: 'black',
        backGrounds: [
            new StarField({ numberOfStars: 30, depth: 1, width: 200, height: 200 })
        ]
    })
    world.ticksPerSecond = 25
    return world
}


export { createShipCloseUp }