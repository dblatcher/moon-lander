import { World } from "physics-worlds";
import { getPlayerRobot } from "./platformGameWorldValues";


function controlRobot(world: World, key: string) {

    const player = getPlayerRobot(world)
    if (!player) { return }

    const throttleRate = player.data.maxThrust ? (player.data.maxThrust / 30) : 200

    switch (key) {
        case 'up':
            player.bounce("UP")
            break;
        case 'right':
            player.bounce("RIGHT")
            break;
        case 'left':
            player.bounce("LEFT")
            break;
    }
}

export {
    controlRobot
}