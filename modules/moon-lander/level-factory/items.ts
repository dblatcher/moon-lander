import { Geometry, shapes, AbstractFill } from "physics-worlds";
import { SpaceShip, SpaceShipData } from "../../world-things/SpaceShip";
import { Terrain } from "../../world-things/Terrain";
import { mountainGradient } from "../../patterns/gradientFills";



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
        fillColor?: string | AbstractFill,
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
            heading: Geometry._360deg / 2,
            instanceId: SpaceShip.PLAYER_INSTANCE_ID
        }, config)

    return new SpaceShip(finalConfig)
}


export { makeMountain, makeShip, makeBuilding }