import { World, StarField } from "physics-worlds";
import { Level } from "../../../Level";
import { generateRocks, makeShip } from "../thingFactories";


export async function makeProceduralLevel(levelNumber: number): Promise<Level> {

    const worldDimensions = {
        width: 1200,
        height: 1200,
    }

    const world = new World([
        makeShip(worldDimensions.width / 2, worldDimensions.height / 2),
        ...generateRocks(levelNumber + 1, worldDimensions, {
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
        ],
        hasWrappingEdges: true,
    });


    return [world];
}
