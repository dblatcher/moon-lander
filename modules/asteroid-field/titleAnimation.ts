import { Force, StarField, World } from "physics-worlds"
import { gloomyBackground } from "../patterns/gradientFills"
import { DistantPlanet } from "../world-things/DistantPlanet"
import { makeRock } from "./level-factory/thingFactories"

export function titleAnimation() {
    const world = new World([
        makeRock(100, 100, 60, Force.none),
        makeRock(190, 25, 20, Force.none),
    ], {
        width: 220,
        height: 220,
        hasWrappingEdges: true,
        fillColor: 'black',
        backGrounds: [
            new StarField({ numberOfStars: 30, depth: 1, width: 220, height: 220 }),
            new DistantPlanet({
                x: 220,
                y: 220,
                radius: 40,
                parallax: 1,
                fillColor: gloomyBackground,
            }),
        ]
    })
    world.ticksPerSecond = 25
    return world
}

