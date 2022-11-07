import { Level, LevelFunction } from "./Level";

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


export { GameMode }