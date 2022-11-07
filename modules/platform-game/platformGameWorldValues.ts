import { Body, World } from "physics-worlds";
import { Robot } from "../world-things/Robot";

interface WorldStatus {
    playerDead?: boolean
    playerLanded?: boolean
}

function getPlayerRobot(world: World): Robot | null {
    const playerBody: Body | undefined = world.bodies.find(body => body instanceof Robot && (body as Robot).isPlayer)
    if (!playerBody) { return null }
    return playerBody as Robot;
}

const getPlayerFuel = (world: World) => {
    const player = getPlayerRobot(world)
    if (!player) { return null }
    return {
        value: player.data.fuel || 0,
        max: player.data.maxFuel || 0
    }
}

const getPlayerThrust = (world: World) => {
    const player = getPlayerRobot(world)
    if (!player) { return null }
    return {
        value: player.data.thrust || 0,
        max: player.data.maxThrust || 1
    }
}

const getPlayerSpeed = (world: World) => {
    const player = getPlayerRobot(world)
    if (!player) { return null }
    return {
        value: player.momentum.magnitude,
        danger: Robot.MAX_IMPACT_SPEED
    }
}

const isChangeToVictory = (oldStatus: WorldStatus, newStatus: WorldStatus): boolean => {
    return (
        (!oldStatus.playerLanded && newStatus.playerLanded)
    ) || false
}

const isChangeToFailure = (oldStatus: WorldStatus, newStatus: WorldStatus): boolean => {
    return (
        (!oldStatus.playerDead && newStatus.playerDead) 
    ) || false
}

const playerIsInactive = (status: WorldStatus): boolean => {
    return status.playerDead || false
}

const getWorldStatus = (world: World): WorldStatus => {
    const player = getPlayerRobot(world)

    return {
        playerDead: !player,
        playerLanded: player?.landingPadIsRestingOn?.typeId === 'LandingPad',
    }
}

export type {
    WorldStatus
}
export {
    getPlayerRobot, getPlayerFuel, getPlayerThrust, getWorldStatus, getPlayerSpeed,
    isChangeToFailure, isChangeToVictory, playerIsInactive,
}