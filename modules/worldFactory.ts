import { Body, Force, World, Geometry, shapes, StarField, Area, RadialGradientFill } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry/definitions";
import { LandingPad } from "./LandingPad";

import { SpaceShip, SpaceShipData } from "./SpaceShip";
import { Terrain } from "./Terrain";

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

const mountainGradient = new RadialGradientFill({
    fallbackColor: 'brown',
    canvasFunction: (ctx: CanvasRenderingContext2D, circle: Circle, heading: number) => {

        const f = Geometry.getXYVector(400, -heading);
        const gradient = ctx.createLinearGradient(
            circle.x-f.x, circle.y-f.y, 
            circle.x+f.x, circle.y+f.y
        )

        gradient.addColorStop(1, 'brown')
        gradient.addColorStop(.1, 'white')
        gradient.addColorStop(0, 'white')
        
        return gradient;
    }
})

function makeMountain(fromLeft: number, size: number, worldDimensions: { height: number, width: number }) {
    return new Terrain({
        x: worldDimensions.width * fromLeft,
        y: worldDimensions.height - (worldDimensions.width * size),
        size: worldDimensions.width * size,
        fillColor: mountainGradient,
        color: 'brown',
        elasticity: .75, immobile: true,
        shape: shapes.polygon,
        corners: [{ x: -1, y: 1 }, { x: -.2, y: -.5 }, { x: 0, y: -1 }, { x: .1, y: -.5 }, { x: .3, y: -.6 }, { x: 1, y: 1 }]
    })
}

function makeShip(config: SpaceShipData) {

    const finalConfig: SpaceShipData = Object.assign(
        {
            size: 15,
            elasticity: .01,
            maxThrust: 3000,
            maxImpact: 50000,
            maxFuel: 2000,
            heading: Geometry._360deg / 2
        }, config)

    return new SpaceShip(finalConfig)
}

const levelFunctions = [
    function makeLevel1(): World {
        const worldDimensions = {
            width: 1400,
            height: 2600
        }

        return new World([
            makeShip({
                x: worldDimensions.width / 2,
                y: 310,
                fuel: 1200,
            }),

            new Area({
                x: worldDimensions.width / 2,
                y: worldDimensions.height,
                fillColor: atmosphere,
                size: worldDimensions.width,
                density: .2
            }),

            new Body({
                x: 610,
                y: 40,
                size: 10,
                elasticity: .75,
                density: 5.01
            }),

            new LandingPad({
                x: worldDimensions.width * (9.25 / 16),
                y: worldDimensions.height - 220,
                size: 75,
                fillColor: 'green',
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),

            new Terrain({
                x: worldDimensions.width * (3 / 4), y: worldDimensions.height,
                size: worldDimensions.width / 4,
                fillColor: 'brown',
                color: 'brown',
                elasticity: .75, immobile: true,
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),

            new Terrain({
                x: worldDimensions.width * (1 / 4), y: worldDimensions.height,
                size: worldDimensions.width / 4,
                fillColor: 'brown',
                color: 'brown',
                elasticity: .75, immobile: true,
                shape: shapes.polygon,
                corners: [{ x: -1, y: -.1 }, { x: 1, y: -.1 }, { x: 1, y: .1 }, { x: -1, y: .1 },]
            }),

            makeMountain(2 / 12, 3.5 / 12, worldDimensions),
            makeMountain(10 / 12, 1 / 18, worldDimensions),
            makeMountain(5.5 / 12, 1 / 12, worldDimensions),
            makeMountain(8 / 12, 2 / 12, worldDimensions),
        ], {
            ...worldDimensions,
            gravitationalConstant: .001,
            globalGravityForce: new Force(100, 0),

            backGrounds: [
                new StarField({
                    numberOfStars: 30,
                    depth: 3,
                    ...worldDimensions
                }),
                new StarField({
                    numberOfStars: 20,
                    depth: 6,
                    ...worldDimensions
                }),
            ],

            edges: {
                left: "WRAP",
                right: "WRAP",
                bottom: "HARD",
                top: "HARD"
            },

        });
    },

    function makeLevel2(): World {

        const worldDimensions = {
            width: 4000,
            height: 4000,
        }

        return new World([
            makeShip({
                x: worldDimensions.width / 2,
                y: (worldDimensions.height / 2) - 1200,
            }),

            new Terrain({
                x: worldDimensions.width / 2,
                y: worldDimensions.height / 2,
                size: 300,
                density: .25,
                fillColor: 'blue',
            }),

            new Area({
                x: worldDimensions.width / 2,
                y: worldDimensions.height / 2,
                size: 700,
                density: .5,
                fillColor: atmosphere,
            }),

            new LandingPad({
                x: 300 + worldDimensions.width / 2,
                y: worldDimensions.height / 2,
                size: 40,
                fillColor: 'green',
                shape: shapes.polygon,
                corners: [{ x: -.25, y: -1 }, { x: .25, y: -1 }, { x: .25, y: 1 }, { x: -.25, y: 1 },]
            }),
        ], {
            ...worldDimensions,
            gravitationalConstant: .001,
            bodiesExertGravity: true,
            hasHardEdges: true,
            backGrounds: [
                new StarField({
                    numberOfStars: 60,
                    depth: 3,
                    ...worldDimensions
                }),
                new StarField({
                    numberOfStars: 40,
                    depth: 6,
                    ...worldDimensions
                }),
            ],
        })

    }
]


const numberOfLevels = levelFunctions.length

function makeWorld(levelNumber = 1) {
    if (levelNumber > numberOfLevels || levelNumber < 1) {
        levelNumber = 1;
    }
    const world = levelFunctions[levelNumber - 1]();
    world.name = "WORLD_" + Date.now().toString();
    console.log("created:", world.name)
    return world
}

export {
    makeWorld, numberOfLevels
}