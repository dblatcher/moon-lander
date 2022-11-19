import { Body, Force } from 'physics-worlds'
import { SpaceShip } from './world-things/SpaceShip'
import { Rock } from './world-things/Rock'


const rockColors = ['gainsboro', 'darksalmon', 'dimgray', 'darkgray', 'azure', 'cornsilk',]

function makeRock(x: number, y: number, size: number, momentum?: Force): Body {
    const fillColor = rockColors[Math.floor(Math.random() * rockColors.length)]

    return new Rock({
        x, y, size,
        color: fillColor,
        fillColor,
        elasticity: .5,
        density: 5,
        headingFollowsDirection: false
    }, momentum)
}


function makeShip(x: number, y: number, color: string): SpaceShip {
    return new SpaceShip({
        x, y, color,
        size: 10,
        density: 10,
        elasticity: .7,
        maxThrust: 15000,
    })
}

export { makeRock, makeShip }
