import { Body, World } from "physics-worlds";
import { SpaceShip } from "./SpaceShip";


interface GetMeterValuesFunction {
    (world: World): { value: number, max: number } | null
}

function getPlayerSpaceship(world: World): SpaceShip | null {
    const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
    if (!playerBody) { return null }
    return playerBody as SpaceShip;
}

const getPlayerFuel: GetMeterValuesFunction = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        value: player.data.fuel || 0,
        max: player.data.maxFuel || 0
    }
}

const getPlayerThrust: GetMeterValuesFunction = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        value: player.data.thrust || 0,
        max: player.data.maxThrust || 0
    }
}

export type {
    GetMeterValuesFunction
}
export {
    getPlayerSpaceship, getPlayerFuel, getPlayerThrust
}