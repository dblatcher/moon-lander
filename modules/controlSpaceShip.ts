import { World } from "physics-worlds";
import { getPlayerSpaceship } from "./worldValues";


function controlSpaceShip(world: World, key: string) {

    const player = getPlayerSpaceship(world)
    if (!player) { return }

    switch (key) {
        case 'up':
            player.changeThrottle(player.data.maxThrust ? player.data.maxThrust / 20 : 10)
            break;
        case 'down':
            player.changeThrottle(player.data.maxThrust ? -player.data.maxThrust / 20 : -10)
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
    controlSpaceShip
}