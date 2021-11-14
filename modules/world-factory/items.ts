import { Geometry, shapes, RadialGradientFill } from "physics-worlds";
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
            circle.x-f.x, circle.y-f.y, 
            circle.x+f.x, circle.y+f.y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.1, 'white')
        gradient.addColorStop(0, 'white')
        
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


export {atmosphere, mountainGradient, makeMountain, makeShip}