import { Force, StarField, World } from "physics-worlds";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { loadManyImageFills } from "../imageFills";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../../utility";

async function level(): Promise<Level> {

    const [jupiter, soil] = await loadManyImageFills(['jupiter', 'soil'])

    const worldDimensions = {
        width: 1000,
        height: 2500,
    }

    const world = new World([
        makeShip({
            x: 200, y: 1350,
            color: 'purple',
        }),

        new Terrain({ x: 200, y: 2450, size: 50, fillColor: soil, color: 'transparent' }),
        new Terrain({ x: 350, y: 2430, size: 60, fillColor: soil, color: 'transparent' }),
        new Terrain({ x: 500, y: 4950, size: 2550, fillColor: jupiter, color: 'transparent', density: .01 }),

        new LandingPad({
            x: 500, y: 2400, fillColor: 'green',
            ...makeRectangleProperties(75, 5)
        })

    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        airDensity: 0.1,
        globalGravityForce: new Force(100, 0),
        hasHardEdges: true,
        backGrounds: [
            new StarField({ numberOfStars: 100, depth: 4, ...worldDimensions }),
            new StarField({ numberOfStars: 100, depth: 10, ...worldDimensions }),
        ],
    });

    const levelIntro = new LevelIntro("moonbase alpha", "classic/1");
    return [world, levelIntro]
}

export { level }