import { GameDefinition } from "../types";
import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './worldValues';

const asteroidField: GameDefinition = {
    title: 'Asteroid Field',
    gameModes,
    route: 'asteroid-field',
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
        'laser': "/audio/asteroid-field/laser.mp3",
    },
    scoreFetcherUrl: '/api/scores',
}

export { asteroidField }