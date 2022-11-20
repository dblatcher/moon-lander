import * as tutorials from "./level-factory/tutorials";

import { GameMode } from "../GameMode";


const gameModes: { [index: string]: GameMode } = {

    'normal': new GameMode({
        title: "normal",
        key: "normal",
        startingLives: Infinity,
        speed: 40,
        noScores: true,
        allowSkip: true,
        allowRestart: true,
        levelFunctions: [
            // tutorials.tutorial1,
            tutorials.tutorial2,
        ]
    }),
}

export { gameModes }