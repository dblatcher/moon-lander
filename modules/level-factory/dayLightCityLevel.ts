import { Force, World, shapes } from "physics-worlds";
import { LevelIntro } from "../LevelIntro";
import { LandingPad } from "../world-things/LandingPad";
import { Terrain } from "../world-things/Terrain";

import { makeBuilding, makeShip } from "./items";
import { asyncCreateImageFill } from "./imageFills";

import { Level } from "../Level";





async function makeDaylightCityLevel(): Promise<Level> {
    const worldDimensions = {
        width: 2800,
        height: 5000
    }
    const soil = await asyncCreateImageFill('soil');
    const world = new World(
        [
            makeShip({
                x: worldDimensions.width * (2 / 12),
                y: worldDimensions.height - (worldDimensions.width * (3 / 16)),
            }),

            makeBuilding((2.5 / 12), (1 / 16), (4 / 4), worldDimensions),
            makeBuilding((2 / 12), (1.5 / 16), (2 / 4), worldDimensions, { fillColor: 'DarkKhaki', color: 'antiquewhite' }),
            makeBuilding((7 / 12), (3.75 / 16), (2 / 4), worldDimensions),
            makeBuilding((6 / 12), (2 / 16), (2 / 4), worldDimensions),
            makeBuilding((9 / 12), (1.5 / 16), (3 / 4), worldDimensions, { fillColor: 'darkseagreen', color: 'antiquewhite' }),
            makeBuilding((11 / 12), (3 / 16), (1 / 4), worldDimensions),

            new LandingPad({
                x: worldDimensions.width * (9.25 / 12),
                y: worldDimensions.height - worldDimensions.width * (3 / 16),
                size: 75,
                fillColor: 'green',
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),

            new Terrain({
                x: worldDimensions.width * (3 / 4), y: worldDimensions.height,
                size: worldDimensions.width / 4,
                fillColor: soil,
                color: 'brown',
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),

            new Terrain({
                x: worldDimensions.width * (1 / 4), y: worldDimensions.height,
                size: worldDimensions.width / 4,
                fillColor: soil,
                color: 'brown',
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),
        ],
        {
            ...worldDimensions,
            gravitationalConstant: .001,
            globalGravityForce: new Force(75, 0),
            airDensity: .25,

            backGrounds: [

            ],

            fillColor: 'skyblue',

            hasHardEdges: true,

        }
    );

    const levelIntro = new LevelIntro(
        "Daylight City", "daylight-city"
    );

    return [world, levelIntro];
}

export { makeDaylightCityLevel }