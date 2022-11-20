import { World, StarField, Force } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { loadImageFill } from "../../../patterns/imageFills";
import { DistantPlanet } from "../../../world-things/DistantPlanet";
import { generateRocks, makeRock, makeShip } from "../thingFactories";


export async function tutorial1(): Promise<Level> {

    const worldDimensions = {
        width: 800,
        height: 800,
    }

    const world = new World([
        makeShip(worldDimensions.width / 2, worldDimensions.height / 2),
        makeRock(400, 400, 100),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        backGrounds: [
            new StarField({ numberOfStars: 100, depth: 1, ...worldDimensions, }),
        ],
        hasWrappingEdges: true
    });

    const levelIntro = new LevelIntro('Tutorial one', 'tutorial-1');


    return [world, levelIntro];
}

export async function tutorial2(): Promise<Level> {

    const [jupiter, neptune] = await Promise.all([
        loadImageFill('jupiter', 'red', { parallax: 2 }),
        loadImageFill('neptune', 'blue', { parallax: 3 }),
    ])

    const worldDimensions = {
        width: 1600,
        height: 1200,
    }

    const world = new World([
        makeShip(worldDimensions.width / 2, worldDimensions.height / 2),
        ...generateRocks(4, worldDimensions, {
            sizes: [70, 100],
            avoid: { x: worldDimensions.width / 2, y: worldDimensions.height / 2, radius: 200 },
            speedRange: [0, 10]
        }),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        airDensity: .01,
        backGrounds: [
            new StarField({ numberOfStars: 50, depth: 4, ...worldDimensions }),
            new StarField({ numberOfStars: 25, depth: 8, ...worldDimensions }),
            new DistantPlanet({
                x: 700,
                y: 200,
                radius: 320,
                parallax: 2,
                fillColor: jupiter,
            }),
            new DistantPlanet({
                x: 800,
                y: 230,
                radius: 240,
                parallax: 3,
                fillColor: neptune,
            }),
        ],
        hasWrappingEdges: true,
    });

    const levelIntro = new LevelIntro('Tutorial Two', 'tutorial-1');


    return [world, levelIntro];
}
