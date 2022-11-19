import { Area, Geometry, StarField, World } from "physics-worlds"
import { gloomyBackground } from "../asteroid-field/level-factory/gradientFills"
import { atmosphere } from "../moon-lander/level-factory/gradientFills"
import { DistantPlanet } from "../world-things/DistantPlanet"




export function wanderingRoids() {
    const world = new World([
        new Area({
            x: -50,
            y: 200,
            fillColor: atmosphere,
            size: 125,
            density: .2
        }),
    ], {
        width: 1000,
        height: 1000,
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
