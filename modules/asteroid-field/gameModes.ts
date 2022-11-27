import * as normal from "./level-factory/normal";
import { GameMode } from "../GameMode";


const gameModes: { [index: string]: GameMode } = {
    'normal': new GameMode({
        title: "arcade",
        key: "normal",
        startingLives: Infinity,
        speed: 40,
        noScores: false,
        allowSkip: true,
        allowRestart: true,
        levelFunctions: [
            normal.level1,
            normal.level2,
        ]
    }),
}

export { gameModes }