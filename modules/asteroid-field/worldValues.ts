import { Body, World } from "physics-worlds";
import { WorldStatus } from "../types";
import { Rock } from "./world-things/Rock";
import { SpaceShip } from "./world-things/SpaceShip";

function getPlayerSpaceship(world: World): SpaceShip | null {
    const playerBody: Body | undefined = world.bodies.find(body => body instanceof SpaceShip && (body as SpaceShip).isPlayer)
    if (!playerBody) { return null }
    return playerBody as SpaceShip;
}

function countRocks(world: World): number {
    return world.bodies.filter(body => body instanceof Rock).length
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
        (!oldStatus.enemiesGone && newStatus.enemiesGone && !newStatus.playerDead)
    ) || false
}

const isChangeToFailure = (oldStatus: WorldStatus, newStatus: WorldStatus): boolean => {
    return (
        (!oldStatus.playerDead && newStatus.playerDead)
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
        enemiesGone: countRocks(world) === 0,
    }
}

export {
    getPlayerSpaceship, getPlayerThrust, getWorldStatus, getPlayerSpeed,
    isChangeToFailure, isChangeToVictory, playerIsInactive,
}