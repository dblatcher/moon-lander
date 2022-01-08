import { Area, Force, Geometry, RadialGradientFill, shapes, StarField, World } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { asyncCreateImageFill } from "../imageFills";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../utility";

async function level(): Promise<Level> {

    const soil = await asyncCreateImageFill('soil');
    const sky = await asyncCreateImageFill('sky');

    const worldDimensions = {
        width: 1000,
        height: 2500,
    }

    const world = new World([
        makeShip({
            x: 150, y: 500,
            color: 'purple',
        }),
        // makeShip({ x:350,y:800,
        //     color:'black', thrust:2500, maxThrust:3000, fuel:Infinity, heading: Geometry._deg*190
        // }),

        new Terrain({ pattern: 'BUILDING', x: 600, y: worldDimensions.height - 210, ...makeRectangleProperties(350, 75), fillColor: 'darkkhaki', color: 'black' }),
        new Terrain({ pattern: 'BUILDING', x: 550, y: worldDimensions.height - 400, ...makeRectangleProperties(100, 250), fillColor: 'darkkhaki', color: 'brown' }),
        new Terrain({ pattern: 'BUILDING', x: 75, y: worldDimensions.height - 400, ...makeRectangleProperties(200, 575), fillColor: 'canvas', color: 'black' }),
        new LandingPad({ x: 550, y: worldDimensions.height - 625, ...makeRectangleProperties(100, 25), fillColor: 'green' }),
        new Terrain({ x: 500, y: worldDimensions.height + 2800, size: 3000, fillColor: soil, }),

    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(75, 0),
        edges: { top: 'SOFT', left: 'WRAP', right: 'WRAP', bottom: 'HARD' },
        fillColor: sky,
        airDensity: .2,
    });

    const levelIntro = new LevelIntro("Planet Fall", "classic/planet-fall");
    return [world, levelIntro]
}

export { level }