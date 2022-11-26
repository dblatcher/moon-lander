import { World, StarField } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { makeRock, makeShip } from "../thingFactories";

export async function level1(): Promise<Level> {

    const worldDimensions = {
        width: 800,
        height: 800,
    }

    const world = new World([
        makeShip(worldDimensions.width / 2, worldDimensions.height / 2),
        makeRock(200, 200, 100),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        backGrounds: [
            new StarField({ numberOfStars: 100, depth: 1, ...worldDimensions, }),
        ],
        hasWrappingEdges: true
    });

    const levelIntro = new LevelIntro('Level One', 'tutorial-1');


    return [world, levelIntro];
}
