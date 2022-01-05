import { Area, Body, shapes, StarField } from "physics-worlds";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { atmosphere } from "../gradientFills";
import { makeRectangleProperties } from "../utility";

function makeTutorialWorldContents(worldDimensions = { width: 1400, height: 1400 }, padPlacement = (1 / 2)) {
    const contents: (Body | Area)[] = [
        new LandingPad({
            x: worldDimensions.width * padPlacement,
            y: worldDimensions.height - (worldDimensions.width / 40),
            fillColor: 'green',
            ...makeRectangleProperties(150, 15),
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
            depth: 10,
            ...worldDimensions
        }),
        new StarField({
            numberOfStars: 50,
            depth: 15,
            ...worldDimensions
        }),
    ];
}

export { makeTutorialWorldContents, makeTutorialAtmo, makeTutorialBackground }