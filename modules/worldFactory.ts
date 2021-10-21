import { Body, Force, World, Geometry, shapes, StarField, Area, RadialGradientFill } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry/definitions";

import { SpaceShip } from "./SpaceShip";
import { Terrain } from "./Terrain";

const worldDimensions = {
    width: 1400,
    height: 2600
}

function makeWorld(color?: string): World {

    return new World([
        new SpaceShip({
            x: worldDimensions.width / 2, y: 310,
            size: 15,
            elasticity: .1,
            maxThrust: 7500,
            maxImpact: 40000,
            heading: Geometry._360deg / 2
        },Force.none),

        new Area({
            x: worldDimensions.width / 2,
            y: worldDimensions.height,
            fillColor: new RadialGradientFill({
                fallbackColor: 'rgba(100,100,200,.5)',
                canvasFunction: (ctx: CanvasRenderingContext2D, circle: Circle, heading: number) => {

                    const gradient = ctx.createRadialGradient(
                        circle.x, circle.y, circle.radius * (1 / 4),
                        circle.x, circle.y, circle.radius
                    )
                    gradient.addColorStop(0, 'rgba(100,100,200,.8)')
                    gradient.addColorStop(1, 'rgba(100,100,200,.1)')
                    return gradient;
                }
            }),
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
            fillColor: 'brown',
            color: 'brown',
            elasticity: .75, immobile: true,
            shape: shapes.polygon,
            corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
        }),

    ], {
        ...worldDimensions,
        gravitationalConstant: .1,
        globalGravityForce: new Force(1, 0),

        backGrounds: [
            new StarField({
                numberOfStars: 15,
                depth: 3,
                ...worldDimensions
            }),
            new StarField({
                numberOfStars: 15,
                depth: 6,
                ...worldDimensions
            }),
        ],

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