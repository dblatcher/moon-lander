import { World } from "physics-worlds";
import { getPlayerRobot } from "./platformGameWorldValues";

export const controlMapping: { [index: string]: string } = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "ArrowDown": "down",
    "Enter":"fire",
    " ": "START",
    "p": "PAUSE",
    "P": "PAUSE",
    "O": "CONTROLTOGGLE",
    "o": "CONTROLTOGGLE",
}

export function controlRobot(world: World, key: string) {

    const player = getPlayerRobot(world)
    if (!player) { return }

    switch (key) {
        case 'up':
            player.bounce(player.data.facing)
            break;
        case 'right':
            player.roll("RIGHT")
            break;
        case 'left':
            player.roll("LEFT")
            break;
        case 'down':
            player.stop()
            break
        case 'fire':
            player.shoot();
            break
    }
}
