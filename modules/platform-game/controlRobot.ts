import { World } from "physics-worlds";
import { getPlayerRobot } from "./platformGameWorldValues";


function controlRobot(world: World, key: string) {

    const player = getPlayerRobot(world)
    if (!player) { return }

    const throttleRate = player.data.maxThrust ? (player.data.maxThrust / 30) : 200

    switch (key) {
        case 'up':
            player.changeThrottle(throttleRate)
            break;
        case 'down':
            player.changeThrottle(-throttleRate)
            player.shoot()
            break;
        case 'right':
            player.steer("RIGHT")
            break;
        case 'left':
            player.steer("LEFT")
            break;
    }
}

export {
    controlRobot
}