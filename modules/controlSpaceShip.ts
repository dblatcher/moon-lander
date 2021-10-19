import { World, Body } from "physics-worlds";
import { SpaceShip } from "./SpaceShip";


function controlSpaceShip(world: World, key: string) {

    const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
    if (!playerBody) { return }

    const player = playerBody as SpaceShip;

    switch (key) {
        case 'up':
            player.changeThrottle(player.data.maxThrust ? player.data.maxThrust / 10 : 10)
            break;
        case 'down':
            player.changeThrottle(player.data.maxThrust ? -player.data.maxThrust / 10 : -10)
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