import { Body, World } from "physics-worlds";
import { WorldStatus } from "../types";
import { SpaceShip } from "./world-things/SpaceShip";

function getPlayerSpaceship(world: World): SpaceShip | null {
    const playerBody: Body | undefined = world.bodies.find(body => body instanceof SpaceShip && (body as SpaceShip).isPlayer)
    if (!playerBody) { return null }
    return playerBody as SpaceShip;
}

const getPlayerFuel = (world: World) => {
    const player = getPlayerSpaceship(world)
    if (!player) { return null }
    return {
        // value: player.data.fuel || 0,
        // max: player.data.maxFuel || 0
        value: 5,
        max: 12,
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
        // danger: SpaceShip.MAX_IMPACT_SPEED
        danger: 100
    }
}

const isChangeToVictory = (oldStatus: WorldStatus, newStatus: WorldStatus): boolean => {
    return (
        (!oldStatus.playerLanded && newStatus.playerLanded)
    ) || false
}

const isChangeToFailure = (oldStatus: WorldStatus, newStatus: WorldStatus): boolean => {
    return (
        (!oldStatus.playerDead && newStatus.playerDead) ||
        (!oldStatus.playerStranded && newStatus.playerStranded)
    ) || false
}

const playerIsInactive = (status: WorldStatus): boolean => {
    return status.playerDead || status.playerStranded || status.playerStranded || false
}

const getWorldStatus = (world: World): WorldStatus => {
    const player = getPlayerSpaceship(world)

    return {
        playerDead: !player,
        playerStranded: false,
        playerLanded: false,
    }
}

export {
    getPlayerSpaceship, getPlayerFuel, getPlayerThrust, getWorldStatus, getPlayerSpeed,
    isChangeToFailure, isChangeToVictory, playerIsInactive,
}