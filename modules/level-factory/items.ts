import { Geometry, shapes, RadialGradientFill, AbstractGradientFill, LinearGradientFill } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry/definitions";
import { SpaceShip, SpaceShipData } from "../world-things/SpaceShip";
import { Terrain } from "../world-things/Terrain";


const atmosphere = new RadialGradientFill({
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
});

const mountainGradient = new RadialGradientFill({
    fallbackColor: 'brown',
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Circle, heading: number) => {

        const f = Geometry.getXYVector(400, -heading);
        const gradient = ctx.createLinearGradient(
            circle.x - f.x, circle.y - f.y,
            circle.x + f.x, circle.y + f.y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.1, 'white')
        gradient.addColorStop(0, 'white')

        return gradient;
    }
})


const gloomyBackground = new LinearGradientFill({
    fallbackColor:'black',
    canvasFunction(ctx: CanvasRenderingContext2D, line:[Geometry.Point, Geometry.Point] ) {
        const gradient = ctx.createLinearGradient(
            line[0].x, line[0].y,line[1].x, line[1].y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.575, 'black')
        gradient.addColorStop(.475, 'black')
        gradient.addColorStop(0, 'brown')

        return gradient;
    }
})

function makeMountain(fromLeft: number, size: number, worldDimensions: { height: number, width: number }) {
    return new Terrain({
        x: worldDimensions.width * fromLeft,
        y: worldDimensions.height - (worldDimensions.width * size),
        size: worldDimensions.width * size,
        fillColor: mountainGradient,
        color: 'brown',
        shape: shapes.polygon,
        corners: [{ x: -1, y: 1 }, { x: -.2, y: -.5 }, { x: 0, y: -1 }, { x: .1, y: -.5 }, { x: .3, y: -.6 }, { x: 1, y: 1 }]
    })
}


function makeBuilding(fromLeft: number, height: number, relativeWidth: number, worldDimensions: { width: number, height: number },
    config: {
        fillColor?: string | AbstractGradientFill,
        color?: string,
    } = {}
) {
    return new Terrain({

        x: worldDimensions.width * fromLeft,
        y: worldDimensions.height - (worldDimensions.width * height),
        size: worldDimensions.width * height,
        fillColor: config.fillColor || "gray",
        color: config.color || 'white',
        shape: shapes.polygon,
        pattern: "BUILDING",
        relativeWidth,
        corners: [
            { x: -relativeWidth, y: -1 },
            { x: relativeWidth, y: -1 },
            { x: relativeWidth, y: 1 },
            { x: -relativeWidth, y: 1 },
        ]
    })

}

function makeShip(config: SpaceShipData) {

    const finalConfig: SpaceShipData = Object.assign(
        {
            size: 20,
            elasticity: .01,
            maxThrust: 6000,
            maxImpact: 50000,
            maxFuel: 4000,
            heading: Geometry._360deg / 2
        }, config)

    return new SpaceShip(finalConfig)
}


export { atmosphere, mountainGradient,gloomyBackground, makeMountain, makeShip, makeBuilding }