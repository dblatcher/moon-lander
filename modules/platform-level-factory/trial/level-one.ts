import { Area, Force, RadialGradientFill, shapes, StarField, World, Geometry } from "physics-worlds";
import type { Circle } from "physics-worlds/dist/src/geometry";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { makeRectangleProperties } from "../../utility";
import { Robot } from "../../world-things/Robot";

const {_deg} = Geometry

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
            x: 200, y: worldDimensions.height-100, instanceId: Robot.PLAYER_INSTANCE_ID,
            heading: Math.PI,
            size: 20,
            elasticity: .01,
            maxImpact: 50000,
            facing: 'RIGHT',
        }),

        new Terrain({ x: 500, y: 4950, size: 2550, shape: shapes.square, fillColor: 'red', color: 'transparent', density: .001 }),
        new Terrain({ x: 350, y: 2480, size: 100, shape: shapes.square, heading:_deg*30, fillColor: 'blue', color: 'transparent', density: .001 }),

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

    const levelIntro = new LevelIntro("Breezio four", "classic/2");
    return [world, levelIntro]
}

export { level }