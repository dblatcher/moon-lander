import * as trial from "./level-factory/trial"
import { GameMode } from "../GameMode";

const plaformGameModes: Record<string, GameMode> = {
    'trial': new GameMode({
        title: "trial game",
        key: 'trial',
        levelFunctions: [
            trial.levelOne
        ]
    })
}


export {  plaformGameModes }