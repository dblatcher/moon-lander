import { AbstractFill, Force, Geometry } from 'physics-worlds'
import { SpaceShip } from '../world-things/SpaceShip'
import { Rock } from '../world-things/Rock'



const rockColors = ['gainsboro', 'darksalmon', 'dimgray', 'darkgray', 'azure', 'cornsilk',]

function makeRock(x: number, y: number, size: number, momentum?: Force, fill?: string | AbstractFill): Rock {
    const fillColor = rockColors[Math.floor(Math.random() * rockColors.length)]

    return new Rock({
        x, y, size,
        color: fillColor,
        fillColor: fill || fillColor,
        elasticity: .5,
        density: 5,
        headingFollowsDirection: false
    }, momentum)
}

const rng = (number: number) => Math.floor(Math.random() * number)


const randomMomentum = (min: number, max: number): Force => {
    const magnitude = min + rng(max - min);
    const heading = rng(360) * Geometry._deg;
    return new Force(magnitude, heading)
}

function generateRocks(amount: number, worldDimensions: { width: number, height: number }, config: {
    sizes?: number[],
    speedRange?: [number, number],
    avoid?: { x: number, y: number, radius: number }
} = {}): Rock[] {

    const {
        sizes = [100],
        speedRange = [0, 0],
        avoid,
    } = config
    const rocks: Rock[] = []
    let tries = 0

    while (tries < 100 * amount && rocks.length < amount) {
        tries++
        const newRock = makeRock(
            rng(worldDimensions.width),
            rng(worldDimensions.height),
            sizes[rocks.length % sizes.length],
            randomMomentum(...speedRange)
        )

        if (rocks.some(rock => rock.isIntersectingWith(newRock))) {
            console.log(tries, 'intersection')
            continue
        }

        if (avoid) {
            const minDistance = (newRock.data.size || 0) + avoid.radius
            const { x, y, radius } = newRock.shapeValues

            if (Math.abs(x - avoid.x) < minDistance && Math.abs(y - avoid.y) < minDistance) {
                console.log(tries, 'avoid')
                continue
            }
        }

        console.log(tries, rocks.length % sizes.length, newRock.data.size)
        rocks.push(newRock)


    }

    return rocks
}


function makeShip(x: number, y: number, color: string = 'red'): SpaceShip {
    return new SpaceShip({
        x, y, color,
        elasticity: .7,
        size: 25,
        maxThrust: 15000,
        instanceId: SpaceShip.PLAYER_INSTANCE_ID,
    })
}

export { makeRock, makeShip, generateRocks }
