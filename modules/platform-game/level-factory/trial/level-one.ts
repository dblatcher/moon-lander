import { Area, Force, RadialGradientFill, shapes, StarField, World, Geometry } from "physics-worlds";
import type { Circle } from "physics-worlds/dist/src/geometry";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { LandingPad } from "../../../world-things/LandingPad";
import { Terrain } from "../../../world-things/Terrain";
import { makeRectangleProperties } from "../../../utility";
import { Robot } from "../../../world-things/Robot";

const { _deg } = Geometry

const octCorner = .4
const octogon: Geometry.Point[] = [
    { x: -(1 - octCorner), y: -1 },
    { x: (1 - octCorner), y: -1 },
    { x: 1, y: -(1 - octCorner) },
    { x: 1, y: (1 - octCorner) },
    { x: (1 - octCorner), y: 1 },
    { x: -(1 - octCorner), y: 1 },
    { x: -1, y: (1 - octCorner) },
    { x: -1, y: -(1 - octCorner) },
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

async function level(): Promise<Level> {

    const bg = new RadialGradientFill({
        fallbackColor: "rgba(150,40,160,.5)",
        canvasFunction(ctx: CanvasRenderingContext2D, circle: Circle, heading: number) {
            const gradient = ctx.createRadialGradient(
                circle.x, circle.y, circle.radius * (1 / 4),
                circle.x, circle.y, circle.radius
            )
            gradient.addColorStop(0, "rgba(150,40,160,1)")
            gradient.addColorStop(.5, "rgba(150,40,160,1)")
            gradient.addColorStop(.975, "rgba(150,40,160,0)")
            gradient.addColorStop(1, "white")
            return gradient;
        }
    })

    const worldDimensions = {
        width: 1000,
        height: 2500,
    }

    const world = new World([

        new Robot({
            x: 200, y: worldDimensions.height - 100, instanceId: Robot.PLAYER_INSTANCE_ID,
            heading: Math.PI,
            size: 20,
            elasticity: .01,
            maxImpact: 50000,
            facing: 'RIGHT',
        }),

        new Terrain({ x: 500, y: 4950, size: 2550, shape: shapes.square, fillColor: 'red', color: 'transparent', density: .001 }),
        new Terrain({ x: 350, y: 2450, size: 100, shape: shapes.polygon, corners: octogon, heading: _deg * 30, fillColor: 'blue', color: 'transparent', density: .001 }),

        new LandingPad({
            x: 700, y: 2400, fillColor: 'green',
            ...makeRectangleProperties(50, 15)
        }),

        new Area({
            x: 500, y: 4950, fillColor: bg, size: 3500, density: 0
        })
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(25, 0),
        hasHardEdges: true,
        backGrounds: [
            new StarField({ numberOfStars: 50, depth: 10, ...worldDimensions }),
            new StarField({ numberOfStars: 50, depth: 20, ...worldDimensions }),
        ],
    });

    return [world]
}

export { level }