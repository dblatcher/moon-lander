import { World, StarField } from "physics-worlds";
import { Level } from "../../../Level";
import { murkyPlanet } from "../../../patterns/gradientFills";
import { loadImageFill } from "../../../patterns/imageFills";
import { DistantPlanet } from "../../../world-things/DistantPlanet";
import { generateRocks, makeShip } from "../thingFactories";


export async function level2(): Promise<Level> {

    const [jupiter, neptune] = await Promise.all([
        loadImageFill('jupiter', 'red', { parallax: 2 }),
        loadImageFill('neptune', 'blue', { parallax: 2, scale: 3 }),
    ])

    const worldDimensions = {
        width: 1200,
        height: 1200,
    }

    const world = new World([
        makeShip(worldDimensions.width / 2, worldDimensions.height / 2),
        ...generateRocks(2, worldDimensions, {
            sizes: [70, 100],
            avoid: { x: worldDimensions.width / 2, y: worldDimensions.height / 2, radius: 200 },
            speedRange: [0, 8]
        }),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        airDensity: .01,
        backGrounds: [
            new StarField({ numberOfStars: 50, depth: 4, ...worldDimensions }),
            new StarField({ numberOfStars: 25, depth: 8, ...worldDimensions }),
            new DistantPlanet({
                x: 1000,
                y: 250,
                radius: 400,
                parallax: 4,
                fillColor: murkyPlanet,
            }),
            new DistantPlanet({
                x: 400,
                y: 630,
                radius: 480,
                parallax: 2,
                fillColor: neptune,
            }),
        ],
        hasWrappingEdges: true,
    });


    return [world];
}
