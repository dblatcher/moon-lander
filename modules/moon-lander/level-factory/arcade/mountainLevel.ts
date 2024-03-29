import { Body, Force, World, shapes, StarField, Area } from "physics-worlds";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { DistantPlanet } from "../../../world-things/DistantPlanet";
import { LandingPad } from "../../../world-things/LandingPad";
import { Terrain } from "../../../world-things/Terrain";
import { atmosphere } from "../../../patterns/gradientFills";
import { loadImageFill } from "../../../patterns/imageFills";
import { makeMountain, makeShip } from "../items";


async function makeMountainsLevel(): Promise<Level> {
    const worldDimensions = {
        width: 1400,
        height: 2600
    }
    const jupiterFill = await loadImageFill('jupiter', undefined, { scale: 3.5, parallax: 5 });
    const world = new World([
        makeShip({
            x: worldDimensions.width / 2,
            y: 310,
        }),

        new Area({
            x: worldDimensions.width / 2,
            y: worldDimensions.height,
            fillColor: atmosphere,
            size: worldDimensions.width,
            density: .2
        }),

        new Body({
            x: 610,
            y: 40,
            size: 10,
            elasticity: .75,
            density: 5.01
        }),

        new LandingPad({
            x: worldDimensions.width * (9.25 / 16),
            y: worldDimensions.height - 220,
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

        makeMountain(2 / 12, 3.5 / 12, worldDimensions),
        makeMountain(10 / 12, 1 / 18, worldDimensions),
        makeMountain(5.5 / 12, 1 / 12, worldDimensions),
        makeMountain(8 / 12, 2 / 12, worldDimensions),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(100, 0),

        backGrounds: [
            new StarField({
                numberOfStars: 30,
                depth: 3,
                ...worldDimensions
            }),
            new StarField({
                numberOfStars: 20,
                depth: 6,
                ...worldDimensions
            }),
            new DistantPlanet({ y: 180, x: 230, radius: 1600, parallax: 5, fillColor: jupiterFill }),
        ],

        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },

    });

    const levelIntro = new LevelIntro('Mountain Drop', 'mountain-drop');

    return [world, levelIntro];
}

export { makeMountainsLevel }