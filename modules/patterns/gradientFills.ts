import { Geometry, RadialGradientFill, LinearGradientFill, ImageFill } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry/definitions";

const { getVectorX, getVectorY } = Geometry

const atmosphere = new RadialGradientFill({
    fallbackColor: 'rgba(100,100,200,.5)',
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Circle, heading: number) => {

        const gradient = ctx.createRadialGradient(
            circle.x, circle.y, circle.radius * (1 / 4),
            circle.x, circle.y, circle.radius
        )
        gradient.addColorStop(0, 'rgba(100,100,200,.8)')
        gradient.addColorStop(1, 'rgba(100,100,200,.1)')
        return gradient;
    }
});

const gloomyBackground = new LinearGradientFill({
    fallbackColor: 'black',
    canvasFunction(ctx: CanvasRenderingContext2D, line: [Geometry.Point, Geometry.Point]) {
        const gradient = ctx.createLinearGradient(
            line[0].x, line[0].y, line[1].x, line[1].y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.575, 'black')
        gradient.addColorStop(.475, 'black')
        gradient.addColorStop(0, 'brown')

        return gradient;
    }
})

const murkyPlanet =  new LinearGradientFill({
    fallbackColor: 'yellowgreen',
    canvasFunction(ctx: CanvasRenderingContext2D, line: [Geometry.Point, Geometry.Point]) {
        const gradient = ctx.createLinearGradient(
            line[0].x, line[0].y, line[1].x, line[1].y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.85, 'yellowgreen')
        gradient.addColorStop(.52, 'whitesmoke')
        gradient.addColorStop(.475, 'yellowgreen')
        gradient.addColorStop(0.1, 'brown')
        gradient.addColorStop(0, 'black')

        return gradient;
    }
})

const brownPlanet =  new LinearGradientFill({
    fallbackColor: 'brown',
    canvasFunction(ctx: CanvasRenderingContext2D, line: [Geometry.Point, Geometry.Point]) {
        const gradient = ctx.createLinearGradient(
            line[0].x, line[0].y, line[1].x, line[1].y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.575, 'red')
        gradient.addColorStop(.475, 'red')
        gradient.addColorStop(0.1, 'brown')

        return gradient;
    }
})

const mountainGradient = new RadialGradientFill({
    fallbackColor: 'brown',
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Circle, heading: number) => {

        const f = Geometry.getXYVector(400, -heading);
        const gradient = ctx.createLinearGradient(
            circle.x - f.x, circle.y - f.y,
            circle.x + f.x, circle.y + f.y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.1, 'white')
        gradient.addColorStop(0, 'white')

        return gradient;
    }
})

const redSwirl = new RadialGradientFill({
    fallbackColor: "pink",
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Geometry.Circle, heading: number) => {

        const offCenter: Geometry.Vector = {
            x: getVectorX(circle.radius * .25, heading),
            y: getVectorY(circle.radius * .25, heading)
        }

        const innerCircle: Geometry.Circle = {
            x: circle.x + offCenter.x,
            y: circle.y + offCenter.y,
            radius: circle.radius * (1 / 2)
        }

        const gradient = ctx.createRadialGradient(innerCircle.x, innerCircle.y, innerCircle.radius, circle.x, circle.y, circle.radius);
        gradient.addColorStop(0, 'red');
        gradient.addColorStop(.1, 'pink');
        gradient.addColorStop(.7, 'crimson');
        gradient.addColorStop(.8, 'crimson');
        gradient.addColorStop(.9, 'pink');
        gradient.addColorStop(1, 'red');

        return gradient;
    }
})

export {
    atmosphere, mountainGradient, gloomyBackground, redSwirl, murkyPlanet, brownPlanet
}