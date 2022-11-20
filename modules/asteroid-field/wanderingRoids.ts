import { Area, Force, Geometry, StarField, World } from "physics-worlds"
import { gloomyBackground, atmosphere } from "../patterns/gradientFills"
import { DistantPlanet } from "../world-things/DistantPlanet"
import { makeRock } from "./thingFactories"




export function wanderingRoids() {
    const world = new World([
        new Area({
            x: 250,
            y: 200,
            fillColor: atmosphere,
            size: 125,
            density: 0.01
        }),
        makeRock(100, 100, 20, Force.fromVector(-5, 1)),
        makeRock(300, 100, 60, Force.fromVector(5, 3)),
        makeRock(800, 300, 20, Force.fromVector(5, 3)),
        makeRock(200, 300, 40, Force.fromVector(1, -5)),
    ], {
        width: 1000,
        height: 1000,
        hasWrappingEdges: true,
        fillColor: 'black',
        backGrounds: [
            new StarField({ numberOfStars: 100, depth: 1, width: 1000, height: 1000 }),
            new DistantPlanet({
                x: 200,
                y: 600,
                radius: 60,
                parallax: 1,
                fillColor: gloomyBackground,
            }),
            new DistantPlanet({
                x: 700,
                y: 200,
                radius: 80,
                parallax: 1,
                fillColor: gloomyBackground,
            }),
        ]
    })
    world.ticksPerSecond = 25
    return world
}
