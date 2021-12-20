import { Force, World, shapes, Geometry } from "physics-worlds";
import { Level } from "../Level";
import { LevelIntro } from "../LevelIntro";

import { LandingPad } from "../world-things/LandingPad";
import { Terrain } from "../world-things/Terrain";
import { gloomyBackground, soil } from "./fills";
import { makeBuilding, makeShip } from "./items";



const jaggedRockWallShape = [
    { x: -1, y: -1 },
    { x: 0, y: -.8 },
    { x: 0.1, y: -.6 },
    { x: 0.3, y: -.3 },
    { x: 0.3, y: -.25 },
    { x: 0.5, y: -.21 },
    { x: 0.2, y: -.1 },
    { x: 0.2, y: .24 },
    { x: 0.5, y: .4 },
    { x: 0.4, y: .7 },
    { x: 0.6, y: .8 },

    { x: -1, y: 1 },
]

const rockShape = [
    { x: -1.0, y: -0.6 },
    { x: -0.65, y: -1.0 },
    { x: 0.65, y: -0.75 },
    { x: .8, y: -0.75 },
    { x: 0.6, y: 0.4 },
    { x: 1, y: 0.6 },
    { x: .55, y: 1 },
    { x: -.25, y: .75 },
    { x: -.55, y: .8 },
    { x: -1, y: .7 },
    { x: -1, y: -.6 },
]

function makeCavernLevel(): Level {
    const worldDimensions = {
        width: 4000,
        height: 2000
    }

    const world = new World([
        makeShip({
            x: worldDimensions.width * (2 / 12),
            y: worldDimensions.height - (worldDimensions.width * (4 / 16)),
        }),

        //starting point
        makeBuilding((2 / 12), (2 / 16), (2 / 4), worldDimensions, { fillColor: 'DarkKhaki', color: 'antiquewhite' }),
        
        makeBuilding((9 / 12), (2.5 / 16), (2 / 4), worldDimensions, { fillColor: 'darkseagreen', color: 'antiquewhite' }),

        new LandingPad({
            x: worldDimensions.width * (9.25 / 12),
            y: worldDimensions.height - worldDimensions.width * (5 / 16),
            size: 75,
            fillColor: 'green',
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

        new Terrain({
            x: worldDimensions.width*(.5/12), y: worldDimensions.height-350, size: 400,
            fillColor: soil, color: 'black', shape: shapes.polygon, heading: -Geometry._deg*50,
            corners:rockShape
        }),

        new Terrain({
            x: worldDimensions.width * (3 / 12), y: worldDimensions.height, size: 200,
            fillColor: soil, color: 'black', shape: shapes.circle,
        }),
        new Terrain({
            x: worldDimensions.width * (1 / 12), y: worldDimensions.height, size: 250,
            fillColor: 'brown', color: 'black', shape: shapes.circle,
        }),
        new Terrain({
            x: 3000, y: worldDimensions.height, size: 450,
            fillColor: 'beige', color: 'black', shape: shapes.circle,
        }),
        new Terrain({
            x: 2000, y: worldDimensions.height - 100, size: 300, heading: Geometry._deg * 45,
            fillColor: soil, color: 'black', shape: shapes.polygon, corners: jaggedRockWallShape,
        }),
        new Terrain({
            x: worldDimensions.width, y: worldDimensions.height, size: 450,
            fillColor: 'beige', color: 'black', shape: shapes.square, heading: Geometry._deg*30
        }),
        new Terrain({
            x: worldDimensions.width, y: 0, size: 850,
            fillColor: 'antiquewhite', color: 'black', shape: shapes.polygon, heading: Geometry._deg*38,
            corners:rockShape
        }),
        new Terrain({
            x: worldDimensions.width*(6/12), y: -250, size: 700, heading:Geometry._deg*180,
            fillColor: 'antiquewhite', color: 'black', shape: shapes.polygon,
            corners:jaggedRockWallShape
        }),
        new Terrain({
            x: worldDimensions.width*(4/12), y: -150, size: 875, heading:Geometry._deg*160,
            fillColor: soil, color: 'black', shape: shapes.polygon,
            corners:jaggedRockWallShape
        }),
        new Terrain({
            x: worldDimensions.width*(8.5/12), y: 0, size: 200,
            fillColor: soil, color: 'black', shape: shapes.polygon, heading: -Geometry._deg*124,
            corners:rockShape
        }),
        new Terrain({
            x: worldDimensions.width*(5.5/12), y: worldDimensions.height-300, size: 400,
            fillColor: 'antiquewhite', color: 'black', shape: shapes.polygon, heading: -Geometry._deg*24,
            corners:rockShape
        }),
        new Terrain({
            x: worldDimensions.width*(7.5/12), y: worldDimensions.height-80, size: 300,
            fillColor: 'antiquewhite', color: 'black', shape: shapes.polygon, heading: -Geometry._deg*150,
            corners:rockShape
        }),

        new Terrain({
            x: 0, y: 0,
            size: worldDimensions.height / 2,
            fillColor: 'brown',
            color: 'brown',
            shape: shapes.polygon,
            corners: jaggedRockWallShape,
        }),
        new Terrain({
            x: 0, y: worldDimensions.height, heading: Geometry._90deg,
            size: worldDimensions.height / 2,
            fillColor: 'brown',
            color: 'brown',
            shape: shapes.polygon,
            corners: jaggedRockWallShape,
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
        globalGravityForce: new Force(75, 0),
        airDensity: .01,
        backGrounds: [
        ],
        fillColor: gloomyBackground,
        hasHardEdges: true,
    });

    const levelIntro = new LevelIntro('Cavern', 'cavern') 

    return [world, levelIntro];
}

export { makeCavernLevel }