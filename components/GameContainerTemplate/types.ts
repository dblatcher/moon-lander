import { Score } from "../../lib/database/arcade-world-scores-table";
import { LevelIntro } from "../../modules/LevelIntro";
import { WorldStatus, KeyMap } from "../../modules/types";

export interface GameContainerState {
    level: number
    score: number
    lives: number
    keyBoardControlInput: KeyMap
    onScreenControlInput: KeyMap
    worldStatus: WorldStatus
    mode: "TITLE" | "PLAY" | "HIGHSCORE" | "INTRO"
    levelIntro?: LevelIntro
    soundEnabled: boolean
    showOnScreenControls: boolean
    scoreData?: {
        message?: string;
        scores: Score[]
    }
}

export type Cord = {
    notes?: number[],
    duration?: number,
    volume?: number,
    type?: OscillatorType;
}

export type Song = Cord[]