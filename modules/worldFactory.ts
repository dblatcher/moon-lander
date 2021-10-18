import { Body, Force, World, Geometry } from "physics-worlds";

import { SpaceShip } from "./SpaceShip";


function makeWorld(color?: string): World {

    return new World([
        new SpaceShip({ x: 50, y: 10, size: 15, elasticity: .25, maxThrust: 7500, heading: Geometry._360deg/2 }, Force.none),
        new Body({ x: 250, y: 40, size: 10, elasticity: .75 }),
    ], {
        width: 400,
        height: 300,
        gravitationalConstant: .1,
        globalGravityForce: new Force(1, 0),
        hasHardEdges: true,
        fillColor: color,
    });
}

type Command = "up" | "left" | "right";

function respondToCommand(world: World, key: Command) {

    const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
    if (!playerBody) { return }

    const player = playerBody as SpaceShip;

    switch (key) {
        case 'up':
            player.changeThrottle(player.data.maxThrust ? player.data.maxThrust / 10 : 10)
            break;
        case 'right':
            player.steer("RIGHT")
            break;
        case 'left':
            player.steer("LEFT")
            break;
    }
}

export type {
    Command
}

export {
    makeWorld, respondToCommand
}