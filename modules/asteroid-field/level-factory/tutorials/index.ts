import { World, StarField, Force } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { gloomyBackground } from "../../../patterns/gradientFills";
import { loadImageFill } from "../../../patterns/imageFills";
import { DistantPlanet } from "../../../world-things/DistantPlanet";
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
            new StarField({ numberOfStars: 100, depth: 1, ...worldDimensions, }),
        ],
        hasWrappingEdges: true
    });

    const levelIntro = new LevelIntro('Tutorial one', 'tutorial-1');


    return [world, levelIntro];
}

export async function tutorial2(): Promise<Level> {

    const jupiter = await loadImageFill('jupiter', 'red', { parallax: 2 })
    const neptune = await loadImageFill('neptune', 'blue', { parallax: 2.5 })

    const worldDimensions = {
        width: 1600,
        height: 1200,
    }

    const world = new World([

        new SpaceShip({
            x: worldDimensions.width / 2,
            y: worldDimensions.height / 2,
            color: 'red',
            size: 25,
            maxThrust: 10000,
            instanceId: SpaceShip.PLAYER_INSTANCE_ID,
        }),

        makeRock(400, 400, 50),
        makeRock(1400, 400, 50, Force.fromVector(10, 5)),
        makeRock(700, 200, 50, Force.fromVector(-6, 5)),
        makeRock(100, 200, 40, Force.fromVector(-3, -1)),

    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        airDensity: .01,
        backGrounds: [
            new StarField({ numberOfStars: 50, depth: 2, ...worldDimensions }),
            new StarField({ numberOfStars: 25, depth: 4, ...worldDimensions }),
            new DistantPlanet({
                x: 700,
                y: 200,
                radius: 160,
                parallax: 2,
                fillColor: jupiter,
            }),
            new DistantPlanet({
                x: 800,
                y: 230,
                radius: 100,
                parallax: 2.5,
                fillColor: neptune,
            }),
        ],
        hasWrappingEdges: true
    });

    const levelIntro = new LevelIntro('Tutorial Two', 'tutorial-1');


    return [world, levelIntro];
}
