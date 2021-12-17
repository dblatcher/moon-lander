import { Body, World } from "physics-worlds";
import { LandingPad } from "./world-things/LandingPad";
import { SpaceShip } from "./world-things/SpaceShip";


function getPlayerSpaceship(world: World): SpaceShip | null {
    const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
    if (!playerBody) { return null }
    return playerBody as SpaceShip;
}

const getPlayerFuel = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        value: player.data.fuel || 0,
        max: player.data.maxFuel || 0
    }
}

const getPlayerThrust = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        value: player.data.thrust || 0,
        max: player.data.maxThrust || 1
    }
}

const getPlayerSpeed = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        value: player.momentum.magnitude,
        danger: SpaceShip.MAX_IMPACT_SPEED
    }
}

interface WorldStatus {
    playerDead?: boolean
    landingPadPlayerIsOn?: LandingPad
    playerStranded?: boolean
}


const getWorldStatus = (world: World): WorldStatus => {
    const player = getPlayerSpaceship(world)

    return {
        playerDead: !player,
        landingPadPlayerIsOn: player?.landingPadIsRestingOn,
        playerStranded: player?.isStranded
    }
}

export type {
    WorldStatus
}
export {
    getPlayerSpaceship, getPlayerFuel, getPlayerThrust, getWorldStatus, getPlayerSpeed
}