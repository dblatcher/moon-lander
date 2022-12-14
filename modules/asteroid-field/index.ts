import { GameDefinition } from "../types";
import { controlMapping } from "./controlSpaceShip";
import { gameModes } from "./gameModes";
import { getWorldStatus, isChangeToFailure, isChangeToVictory, playerIsInactive } from './worldValues';
import { songs } from "./songs"

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
        'die': "/audio/asteroid-field/ship-die.mp3",
        'bang': "/audio/asteroid-field/thud.mp3",
        'crumble': "/audio/asteroid-field/crumble.mp3",
        'laser': "/audio/asteroid-field/laser.mp3",
    },
    scoreFetcherUrl: '/api/scores',
    songs,
}

export { asteroidField }