import { World } from "physics-worlds";
import {
    LevelFunction,
    makeDaylightCityLevel,
    makeMountainsLevel,
    makeCityLevel,
    makeBlueMoonLevel,
    makeCavernLevel,
} from "./world-factory";


interface GameModeInput {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed?: number
    startingLives?: number
}

class GameMode implements GameModeInput {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed: number
    startingLives: number

    constructor(input: GameModeInput) {
        this.title = input.title
        this.key = input.key
        this.levelFunctions = input.levelFunctions
        this.makeWorld = this.makeWorld.bind(this)
        this.speed = input.speed || 50
        this.startingLives = input.startingLives || 2
    }

    get numberOfLevels(): number {
        return this.levelFunctions.length
    }

    makeWorld(levelNumber = 1): World {
        if (levelNumber > this.numberOfLevels || levelNumber < 1) {
            levelNumber = 1;
        }
        const world = this.levelFunctions[levelNumber - 1]();
        world.name = "WORLD_" + Date.now().toString();
        return world
    }
}

const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade mode",
        key: "normal",
        levelFunctions: [
            makeDaylightCityLevel,
            makeMountainsLevel,
            makeCityLevel,
            makeBlueMoonLevel,
            makeCavernLevel,
        ]
    }),
    'tutorial': new GameMode({
        title: "tutorial",
        key: "tutorial",
        speed: 75,
        levelFunctions: [
            makeCityLevel,
        ]
    }),
}

export type { GameMode }
export { gameModes }