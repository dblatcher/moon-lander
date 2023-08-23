import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from '../../modules/moon-lander/moonLanderWorldValues';
import { GameDefinition } from "../types";

const moonLander: GameDefinition = {
    title: 'Moon Lander',
    gameModes,
    route: 'moon-lander',
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
    highScoreGameId: 'moon-lander',
}

export { moonLander }