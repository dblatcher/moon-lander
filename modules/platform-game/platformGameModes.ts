import * as trial from "../platform-level-factory/trial"
import { GameMode } from "../GameMode";

const plaformGameModes: Record<string, GameMode> = {
    'trial': new GameMode({
        title: "plaform game",
        key: 'trial',
        levelFunctions: [
            trial.levelOne
        ]
    })
}


export {  plaformGameModes }