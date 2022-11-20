import { Geometry, shapes, AbstractFill } from "physics-worlds";
import { SpaceShip, SpaceShipData } from "../world-things/SpaceShip";
import { mountainGradient } from "../../patterns/gradientFills";



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


export {  makeShip }