import { Area, Force, RadialGradientFill, shapes, StarField, World } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry";
import { Level } from "../../../Level";
import { LevelIntro } from "../../../LevelIntro";
import { LandingPad } from "../../../world-things/LandingPad";
import { Terrain } from "../../../world-things/Terrain";
import { loadImageFill } from "../imageFills";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../../../utility";

async function level(): Promise<Level> {

    const soil = await loadImageFill('soil', 'brown', { scale: 1.5, rotate:5 });

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
        makeShip({
            x: 150, y: worldDimensions.height - 1200,
            color: 'purple',
        }),

        new Terrain({ x: 500, y: 4950, size: 2550, shape: shapes.square, fillColor: soil, color: 'transparent', density: .01 }),

        new LandingPad({
            x: 500, y: 2400, fillColor: 'green',
            ...makeRectangleProperties(150, 15)
        }),

        new Area({
            x: 500, y: 4950, fillColor: bg, size: 3500, density: .4
        })
    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(75, 0),
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