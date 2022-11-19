import { World } from "physics-worlds";
import { getPlayerSpaceship } from "./worldValues";


export const controlMapping: Record<string, string> = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "e": "fire",
    "ArrowDown": "down",
    " ": "START",
    "p": "PAUSE",
    "P": "PAUSE",
    "O": "CONTROLTOGGLE",
    "o": "CONTROLTOGGLE",
}

export function controlSpaceShip(world: World, key: string) {

    const player = getPlayerSpaceship(world)
    if (!player) { return }

    const throttleRate = player.data.maxThrust ? (player.data.maxThrust * .2) : 200

    switch (key) {
        case 'up':
            player.changeThrottle(throttleRate)
            break;
        case 'down':
            player.changeThrottle(-throttleRate)
            break;
        case 'right':
            player.steer("RIGHT")
            break;
        case 'left':
            player.steer("LEFT")
            break;
        case 'fire':
            player.shoot()
            break;
    }
}

