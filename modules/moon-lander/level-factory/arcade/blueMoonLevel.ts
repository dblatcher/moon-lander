import { World, shapes, StarField, Area } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { LandingPad } from "../../../world-things/LandingPad";
import { Terrain } from "../../../world-things/Terrain";
import { loadImageFill } from "../../../patterns/imageFills";
import { atmosphere } from "../../../patterns/gradientFills";
import { makeShip } from "../items";

async function makeBlueMoonLevel(): Promise<Level> {

    const worldDimensions = {
        width: 4000,
        height: 4000,
    }

    const planetRadius = 350;
    const atmosphereThickness = 400;
    const neptune = await loadImageFill('neptune');

    const world = new World([
        makeShip({
            x: worldDimensions.width * (3 / 8),
            y: (worldDimensions.height * (1 / 2)) - planetRadius * 3,
        }),

        new Terrain({
            x: worldDimensions.width * (1 / 2),
            y: worldDimensions.height * (1 / 2),
            size: planetRadius,
            density: .20,
            fillColor: neptune,
            color: 'transparent',
        }),

        new Area({
            x: worldDimensions.width * (1 / 2),
            y: worldDimensions.height * (1 / 2),
            size: planetRadius + atmosphereThickness,
            density: .5,
            fillColor: atmosphere,
        }),

        new LandingPad({
            x: worldDimensions.width * (1 / 2) + planetRadius,
            y: worldDimensions.height * (1 / 2),
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