import { Force, World, shapes, StarField } from "physics-worlds";
import { LandingPad } from "../world-things/LandingPad";
import { Terrain } from "../world-things/Terrain";
import { makeBuilding, makeShip } from "./items";




function makeCityLevel(): World {
    const worldDimensions = {
        width: 2800,
        height: 5000
    }

    return new World([
        makeShip({
            x: worldDimensions.width * (2 / 12),
            y: worldDimensions.height - (worldDimensions.width * (6 / 16)),
        }),


        makeBuilding((3.5 / 12), (1.5 / 16), (1 / 1), worldDimensions),
        makeBuilding((2 / 12), (3 / 16), (1 / 2), worldDimensions),
        makeBuilding((6.5 / 12), (5 / 16), (1 / 4), worldDimensions),
        makeBuilding((6 / 12), (2 / 16), (1 / 2), worldDimensions),
        makeBuilding((11 / 12), (4 / 16), (1 / 4), worldDimensions),
        makeBuilding((9 / 12), (1.5 / 16), (1 / 1), worldDimensions),

        new LandingPad({
            x: worldDimensions.width * (9.25 / 12),
            y: worldDimensions.height - worldDimensions.width * (3/16),
            size: 75,
            fillColor: 'green',
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

        new Terrain({
            x: worldDimensions.width * (3 / 4), y: worldDimensions.height,
            size: worldDimensions.width / 4,
            fillColor: 'brown',
            color: 'brown',
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

        new Terrain({
            x: worldDimensions.width * (1 / 4), y: worldDimensions.height,
            size: worldDimensions.width / 4,
            fillColor: 'brown',
            color: 'brown',
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),


    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(50, 0),

        backGrounds: [
            new StarField({
                numberOfStars: 80,
                depth: 3,
                ...worldDimensions
            }),
            new StarField({
                numberOfStars: 20,
                depth: 6,
                ...worldDimensions
            }),
        ],

        hasHardEdges: true,

    });
}

export { makeCityLevel }