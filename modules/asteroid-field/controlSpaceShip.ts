import { World } from "physics-worlds";
import { KeyMap } from "../types";
import { getPlayerSpaceship } from "./worldValues";


export const controlMapping: Record<string, string> = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "e": "fire",
    "Control": "fire",
    " ": "START",
    "p": "PAUSE",
    "P": "PAUSE",
    "O": "CONTROLTOGGLE",
    "o": "CONTROLTOGGLE",
}

export function controlSpaceShip(world: World, keyMap: KeyMap) {
    const player = getPlayerSpaceship(world)
    if (!player) { return }

    player.setBoosters(keyMap['up'] || false)

    if (keyMap['fire']) {
        player.shoot()
    }
    if (keyMap['right']) {
        player.steer("RIGHT")
    }
    if (keyMap['left']) {
        player.steer("LEFT")
    }
}

