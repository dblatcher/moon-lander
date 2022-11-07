import { Force, Geometry, World } from "physics-worlds";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { loadManyImageFills } from "../imageFills";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../../utility";

async function level(): Promise<Level> {

    const [sky, soil] = await loadManyImageFills(['sky', 'soil'])

    const worldDimensions = {
        width: 1000,
        height: 2500,
    }

    const world = new World([
        makeShip({
            x: 150, y: 500, color: 'red',
        }),
        makeShip({ x:450,y:850,
            instanceId:'passing ship',
            size:35,
            color:'black', thrust:20000, maxThrust:30000, fuel:Infinity, heading: Geometry._deg*195
        }),
        makeShip({ x:650,y:worldDimensions.height - 700,
            instanceId:'passing ship',
            size:35,
            color:'black', thrust:20000, maxThrust:30000, fuel:Infinity, heading: Geometry._deg*180
        }),
        makeShip({ x:100,y:worldDimensions.height - 1500,
            instanceId:'passing ship',
            size:35,
            color:'black', thrust:10000, maxThrust:30000, fuel:Infinity, heading: Geometry._deg*180
        }),
        makeShip({ x:510,y:worldDimensions.height - 650,
            instanceId:'still ship',
            color:'black', 
        }),

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