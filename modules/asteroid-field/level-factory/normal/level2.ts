import { World, StarField } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { loadImageFill } from "../../../patterns/imageFills";
import { DistantPlanet } from "../../../world-things/DistantPlanet";
import { generateRocks, makeShip } from "../thingFactories";


export async function level2(): Promise<Level> {

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
                radius: 640,
                parallax: 2,
                fillColor: jupiter,
            }),
            new DistantPlanet({
                x: 1100,
                y: 230,
                radius: 320,
                parallax: 3,
                fillColor: neptune,
            }),
        ],
        hasWrappingEdges: true,
    });

    const levelIntro = new LevelIntro('Level Two', 'tutorial-1');


    return [world, levelIntro];
}
