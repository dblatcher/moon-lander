import { LevelIntro } from "../../modules/LevelIntro";
import { WorldStatus } from "../../modules/types";

export interface GameContainerState {
    level: number
    score: number
    lives: number,
    keyBoardControlInput: { [index: string]: boolean }
    onScreenControlInput: { [index: string]: boolean }
    worldStatus: WorldStatus
    mode: "TITLE" | "PLAY" | "HIGHSCORE" | "INTRO"
    levelIntro?: LevelIntro
    soundEnabled: boolean
    showOnScreenControls: boolean
}
