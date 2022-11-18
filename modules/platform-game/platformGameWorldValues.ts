import { Body, World } from "physics-worlds";
import { Robot } from "../world-things/Robot";
import { WorldStatus } from "../../components/GameContainerTemplate/types"


function getPlayerRobot(world: World): Robot | null {
    const playerBody: Body | undefined = world.bodies.find(body => body instanceof Robot && (body as Robot).isPlayer)
    if (!playerBody) { return null }
    return playerBody as Robot;
}

const getPlayerMotion = (world: World) => {
    const player = getPlayerRobot(world)
    if (!player) { return null }
    return {
        facing: player.data.facing,
        rolling: player.data.rolling || 0,
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
    getPlayerRobot, getWorldStatus, getPlayerSpeed, getPlayerMotion,
    isChangeToFailure, isChangeToVictory, playerIsInactive,
}