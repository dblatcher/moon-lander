import { Body, World } from "physics-worlds";
import { LandingPad } from "./LandingPad";
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

interface WorldStatus {
    playerDead?: boolean
    landingPadPlayerIsOn?: LandingPad
}

interface WorldStatusFunction {
    (world: World) : WorldStatus
}

const getWorldStatus = (world:World) => {
    const player = getPlayerSpaceship(world)

    return {
        playerDead: !player,
        landingPadPlayerIsOn: player?.landingPadIsRestingOn
    }
}

export type {
    GetMeterValuesFunction, WorldStatusFunction, WorldStatus
}
export {
    getPlayerSpaceship, getPlayerFuel, getPlayerThrust, getWorldStatus
}