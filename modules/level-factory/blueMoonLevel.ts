import { World, shapes, StarField, Area } from "physics-worlds";
import { Level } from "../Level";
import { LevelIntro } from "../LevelIntro";
import { LandingPad } from "../world-things/LandingPad";
import { Terrain } from "../world-things/Terrain";
import { atmosphere, makeShip } from "./items";

function makeBlueMoonLevel(): Level {

    const worldDimensions = {
        width: 4000,
        height: 4000,
    }

    const world = new World([
        makeShip({
            x: worldDimensions.width / 2,
            y: (worldDimensions.height / 2) - 1200,
        }),

        new Terrain({
            x: worldDimensions.width / 2,
            y: worldDimensions.height / 2,
            size: 300,
            density: .20,
            fillColor: 'blue',
        }),

        new Area({
            x: worldDimensions.width / 2,
            y: worldDimensions.height / 2,
            size: 700,
            density: .5,
            fillColor: atmosphere,
        }),

        new LandingPad({
            x: 300 + worldDimensions.width / 2,
            y: worldDimensions.height / 2,
            size: 40,
            fillColor: 'green',
            shape: shapes.polygon,
            corners: [{ x: -.25, y: -1 }, { x: .25, y: -1 }, { x: .25, y: 1 }, { x: -.25, y: 1 },]
        }),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        bodiesExertGravity: true,
        hasHardEdges: true,
        backGrounds: [
            new StarField({
                numberOfStars: 60,
                depth: 3,
                ...worldDimensions
            }),
            new StarField({
                numberOfStars: 40,
                depth: 6,
                ...worldDimensions
            }),
        ],
    })

    const levelIntro = new LevelIntro("Blue Moon", "blue-moon");

    return [world, levelIntro];
}

export { makeBlueMoonLevel }