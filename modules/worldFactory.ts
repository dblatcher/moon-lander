import { Body, Force, World } from "physics-worlds";

function makeWorld(color?: string): World {

    return new World([
        new Body({ x: 50, y: 10, size: 20, elasticity: .75 }),
        new Body({ x: 250, y: 40, size: 10, elasticity: .75 }),
    ], {
        width: 400,
        height: 300,
        gravitationalConstant: 1,
        globalGravityForce: new Force(1, 0),
        hasHardEdges: true,
        fillColor: color,
    });
}

type Command = "up" | "left";

function respondToCommand(world: World, key: Command) {

    switch (key) {
        case 'up':
            world.bodies[0].momentum = new Force(10, Math.PI)
            break;
        case 'left':
            world.bodies[0].momentum = new Force(10, Math.PI * .5)
            break;
    }
}

export type {
    Command
}

export {
    makeWorld, respondToCommand
}