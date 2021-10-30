import { Body, Force, World, Geometry, shapes, StarField, Area, RadialGradientFill } from "physics-worlds";
import { Circle } from "physics-worlds/dist/src/geometry/definitions";
import { LandingPad } from "./LandingPad";

import { SpaceShip } from "./SpaceShip";
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

const levelFunctions = [
    function makeLevel1(): World {
        const worldDimensions = {
            width: 1400,
            height: 2600
        }

        return new World([
            new SpaceShip({
                x: worldDimensions.width / 2, y: 310,
                size: 15,
                elasticity: .1,
                maxThrust: 7500,
                maxImpact: 40000,
                heading: Geometry._360deg / 2
            }, Force.none),

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
                x: worldDimensions.width * (3 / 16),
                y: worldDimensions.height - 100,
                size: 100,
                fillColor: 'green',
                shape: shapes.square,
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
            new SpaceShip({
                x: worldDimensions.width / 2,
                y: 500,
                size: 15,
                elasticity: .1,
                maxThrust: 7500,
                maxImpact: 40000,
                maxFuel: 10000,
                heading: Geometry._360deg / 2
            }, Force.none),

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
                size: 25,
                fillColor: 'green',
                shape: shapes.square,
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
        return levelFunctions[0]()
    }
    return levelFunctions[levelNumber - 1]()
}

export {
    makeWorld, numberOfLevels
}