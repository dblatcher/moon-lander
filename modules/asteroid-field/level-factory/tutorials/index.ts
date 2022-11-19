import { World, StarField } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { makeRock } from "../../thingFactories";
import { SpaceShip } from "../../world-things/SpaceShip";


export async function tutorial1(): Promise<Level> {

    const worldDimensions = {
        width: 800,
        height: 800,
    }

    const world = new World([

        new SpaceShip({
            x: 100,
            y: 100,
            color: 'red',
            size: 25,
            maxThrust: 10000,
            instanceId: SpaceShip.PLAYER_INSTANCE_ID,
        }),

        makeRock(400, 400, 10),

    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        backGrounds: [
            new StarField({ numberOfStars: 100, depth: 1, width: 1000, height: 1000 }),
        ],
        hasWrappingEdges: true
    });

    const levelIntro = new LevelIntro('Tutorial one', 'tutorial-1');


    return [world, levelIntro];
}
