import { World, Area, Body, shapes, Force, StarField } from "physics-worlds";
import { Level } from "../Level";
import { LevelIntro } from "../LevelIntro";
import { LandingPad } from "../world-things/LandingPad";
import { Terrain } from "../world-things/Terrain";
import { atmosphere } from "./fills";
import { makeShip } from "./items";



function makeTutorialWorldContents(worldDimensions = { width: 1400, height: 1400 }, padPlacement = (1 / 2)) {
    const contents: (Body | Area)[] = [
        new LandingPad({
            x: worldDimensions.width * padPlacement,
            y: worldDimensions.height - (worldDimensions.width / 40),
            size: 150,
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
    ]

    return contents;
}

function makeTutorialAtmo(worldDimensions = { width: 1400, height: 1400 }) {
    return new Area({
        x: worldDimensions.width / 2,
        y: worldDimensions.height,
        fillColor: atmosphere,
        size: worldDimensions.width,
        density: .2
    })
}

function makeTutorialBackground(worldDimensions = { width: 1400, height: 1400 }) {
    return [
        new StarField({
            numberOfStars: 20,
            depth: 3,
            ...worldDimensions
        }),
        new StarField({
            numberOfStars: 50,
            depth: 6,
            ...worldDimensions
        }),
    ];
}

export function tutorial1(): Level {

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

export function tutorial2(): Level {

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

export function tutorial3(): Level {

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