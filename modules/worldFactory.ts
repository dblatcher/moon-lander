import { Body, Force, World, Geometry, shapes } from "physics-worlds";

import { SpaceShip } from "./SpaceShip";
import { Terrain } from "./Terrain";

const worldDimensions = {
    width: 800,
    height: 600
}

function makeWorld(color?: string): World {

    return new World([
        new SpaceShip({
            x: 250, y: 310,
            size: 15,
            elasticity: .25,
            maxThrust: 7500,
            maxImpact: 20000,
            heading: Geometry._360deg / 2
        },
            Force.none),

        new Body({
            x: 250,
            y: 40,
            size: 100,
            elasticity: .75,
            density: .0001
        }),

        new Terrain({
            x: worldDimensions.width * (3 / 4), y: worldDimensions.height,
            size: worldDimensions.width / 4,
            fillColor: 'brown',
            color: 'brown',
            elasticity: .75, immobile: true,
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

        new Terrain({
            x: worldDimensions.width * (1 / 4), y: worldDimensions.height,
            size: worldDimensions.width / 4,
            elasticity: .75, immobile: true,
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

    ], {
        ...worldDimensions,
        gravitationalConstant: .1,
        globalGravityForce: new Force(1, 0),

        edges: {
            left: "WRAP",
            right: "WRAP",
            bottom: "HARD",
            top: "HARD"
        },

        fillColor: color,
    });
}

function getPlayerSpaceship(world: World): SpaceShip | null {
    const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
    if (!playerBody) { return null }
    return playerBody as SpaceShip;
}

export {
    makeWorld, getPlayerSpaceship
}