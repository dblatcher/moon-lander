import { GameDefinition } from "../types";
import { controlMapping } from "./controlRobot";
import { plaformGameModes } from "./platformGameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './platformGameWorldValues';

const platformGame: GameDefinition = {
    title: "Roving' Robot",
    gameModes: plaformGameModes,
    route: 'platform',
    controlMapping,
    statusFunctions: {
        getWorldStatus,
        isChangeToFailure,
        isChangeToVictory,
        playerIsInactive
    },
    soundEffects: {
        'die': "/audio/die.mp3",
        'bang': "/audio/bang.mp3",
        'beep': "/audio/beep.mp3",
    },
    highScoreGameId: 'platform-game',
}

export { platformGame }