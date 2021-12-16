import {
    makeDaylightCityLevel,
    makeMountainsLevel,
    makeCityLevel,
    makeBlueMoonLevel,
    makeCavernLevel,
    tutorial1,
    tutorial2,
    tutorial3,
} from "./level-factory";
import { Level, LevelFunction } from "./Level";


interface GameModeInput {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed?: number
    startingLives?: number
    noScores?: boolean
}

class GameMode implements Required<GameModeInput> {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed: number
    startingLives: number
    noScores: boolean

    constructor(input: GameModeInput) {
        this.title = input.title
        this.key = input.key
        this.levelFunctions = input.levelFunctions
        this.makeLevel = this.makeLevel.bind(this)
        this.speed = input.speed || 50
        this.startingLives = input.startingLives || 2
        this.noScores = input.noScores || false
    }

    get numberOfLevels(): number {
        return this.levelFunctions.length
    }

    makeLevel(levelNumber = 1): Level {
        if (levelNumber > this.numberOfLevels || levelNumber < 1) {
            levelNumber = 1;
        }

        const level = this.levelFunctions[levelNumber - 1]()
        const [world] = level;
        world.name = "WORLD_" + Date.now().toString();
        return level
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
        startingLives: Infinity,
        speed: 40,
        noScores: true,
        levelFunctions: [
            tutorial1,
            tutorial2,
            tutorial3,
        ]
    }),
}

export type { GameMode }
export { gameModes }