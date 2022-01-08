import { Level, LevelFunction } from "./Level";

import * as tutorials from "./level-factory/tutorials";
import * as arcade from "./level-factory/arcade";
import * as classics from "./level-factory/classic";

interface GameModeInput {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed?: number
    startingLives?: number
    noScores?: boolean
    hidden?: boolean
    allowSkip?: boolean
    allowRestart?: boolean
}

class GameMode implements Required<GameModeInput> {
    title: string
    key: string
    levelFunctions: LevelFunction[]
    speed: number
    startingLives: number
    noScores: boolean
    hidden: boolean
    allowSkip: boolean
    allowRestart: boolean

    constructor(input: GameModeInput) {
        this.title = input.title
        this.key = input.key
        this.levelFunctions = input.levelFunctions
        this.makeLevel = this.makeLevel.bind(this)
        this.speed = input.speed || 50
        this.startingLives = input.startingLives || 2
        this.noScores = input.noScores || false
        this.hidden = input.hidden || false
        this.allowRestart = input.allowRestart || false
        this.allowSkip = input.allowSkip || false
    }

    get numberOfLevels(): number {
        return this.levelFunctions.length
    }

    async makeLevel(levelNumber = 1): Promise<Level> {
        if (levelNumber > this.numberOfLevels || levelNumber < 1) {
            levelNumber = 1;
        }

        const level = await this.levelFunctions[levelNumber - 1]()
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
            arcade.makeDaylightCityLevel,
            arcade.makeMountainsLevel,
            arcade.makeCityLevel,
            arcade.makeBlueMoonLevel,
            arcade.makeCavernLevel,
        ]
    }),
    'trainer': new GameMode({
        title: "arcade mode(trainer)",
        key: "trainer",
        startingLives: Infinity,
        noScores: true,
        hidden: true,
        allowSkip:true,
        allowRestart:true,
        levelFunctions: [
            arcade.makeDaylightCityLevel,
            arcade.makeMountainsLevel,
            arcade.makeCityLevel,
            arcade.makeBlueMoonLevel,
            arcade.makeCavernLevel,
        ]
    }),
    'tutorial': new GameMode({
        title: "tutorial",
        key: "tutorial",
        startingLives: Infinity,
        speed: 40,
        noScores: true,
        allowSkip:true,
        allowRestart:true,
        levelFunctions: [
            tutorials.tutorial1,
            tutorials.tutorial2,
            tutorials.tutorial3,
            tutorials.tutorial4,
        ]
    }),

    'classic': new GameMode({
        title:"Classic levels",
        key:"classic",
        hidden:true,
        noScores: true,
        allowRestart:true,
        allowSkip:true,
        startingLives: 3,
        levelFunctions: [
            classics.breezio,
            classics.moonbaseAlpha,
            classics.grandCanyon,
        ]
    })
}

export type { GameMode }
export { gameModes }