import { World, Force } from "physics-worlds";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { RefuelPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../utility";


import { makeTutorialWorldContents, makeTutorialAtmo, makeTutorialBackground } from './generics';


export async function tutorial1(): Promise<Level> {

    const worldDimensions = {
        width: 1400,
        height: 1400
    }

    const world = new World([
        makeShip({
            x: worldDimensions.width / 2,
            y: 600,
        }),
        ...makeTutorialWorldContents(worldDimensions, (9.25 / 16)),
        makeTutorialAtmo(worldDimensions),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(100, 0),
        backGrounds: makeTutorialBackground(worldDimensions),
        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },
    });

    const levelIntro = new LevelIntro('Tutorial one', 'tutorial-1');
    return [world, levelIntro];
}

export async function tutorial2(): Promise<Level> {

    const worldDimensions = {
        width: 2800,
        height: 1200
    }

    const world = new World([
        makeShip({
            x: worldDimensions.width * (1 / 4),
            y: worldDimensions.height - 50,
        }),
        ...makeTutorialWorldContents(worldDimensions, (12 / 16)),
        makeTutorialAtmo(worldDimensions),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(100, 0),
        backGrounds: makeTutorialBackground(worldDimensions),

        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },

    });

    const levelIntro = new LevelIntro('Tutorial two', 'tutorial-2');
    return [world, levelIntro];
}

export async function tutorial3(): Promise<Level> {

    const worldDimensions = {
        width: 2800,
        height: 1200
    }

    const world = new World([
        makeShip({
            x: worldDimensions.width * (1 / 4),
            y: worldDimensions.height - 50,
        }),
        ...makeTutorialWorldContents(worldDimensions, (12 / 16)),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(70, 0),
        backGrounds: makeTutorialBackground(worldDimensions),

        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },

    });

    const levelIntro = new LevelIntro('Tutorial three', 'tutorial-3');
    return [world, levelIntro];
}

export async function tutorial4(): Promise<Level> {

    const worldDimensions = {
        width: 2800,
        height: 1200
    }



    const world = new World([
        makeShip({
            x: worldDimensions.width * (1 / 4),
            y: worldDimensions.height - 50,
            fuel: 1000,
        }),
        ...makeTutorialWorldContents(worldDimensions, (12 / 16)),
        makeTutorialAtmo(worldDimensions),


        new Terrain({
            x: worldDimensions.width * (7 / 16),
            y: worldDimensions.height - 50 - (worldDimensions.width / 40),
            fillColor: 'grey',
            ...makeRectangleProperties(120, 50),
        }),

        new RefuelPad({
            x: worldDimensions.width * (7 / 16),
            y: worldDimensions.height - 50 - 50 - 10 - (worldDimensions.width / 40),
            fillColor: 'red',
            ...makeRectangleProperties(75, 10),
            fuel: 2000, maxFuel: 2500, renderIndicator: true
        }),
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(100, 0),
        backGrounds: makeTutorialBackground(worldDimensions),

        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },

    });

    const levelIntro = new LevelIntro('Tutorial Four', 'tutorial-4');
    return [world,levelIntro];
}