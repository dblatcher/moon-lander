import * as normal from "./level-factory/normal";
import { GameMode } from "../GameMode";


const modeConfig = {
    speed: 40,
    noScores: false,
    levelFunctions: [
        normal.level1,
        () => { return normal.makeProceduralLevel(1) },
        normal.level2,
        normal.level3,
    ],
    makeProceduralLevel: normal.makeProceduralLevel
}

const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade",
        key: "normal",
        ...modeConfig
    }),
    'trainer': new GameMode({
        key: 'trainer',
        title: 'trainer',
        ...modeConfig,
        startingLives: Infinity,
        allowSkip: true,
        allowRestart: true,
        noScores: true,
        hidden: true,
    }),
}

export { gameModes }