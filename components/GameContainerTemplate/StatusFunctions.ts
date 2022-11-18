import { World } from "physics-worlds";
import { LevelIntro } from "../../modules/LevelIntro";

export interface WorldStatus {
    playerDead?: boolean
    playerStranded?: boolean
    playerLanded?: boolean
}

export type StatusFunctions = {
    getWorldStatus: { (world: World): WorldStatus };
    isChangeToFailure: { (oldStatus: WorldStatus, newStatus: WorldStatus): boolean };
    isChangeToVictory: { (oldStatus: WorldStatus, newStatus: WorldStatus): boolean };
    playerIsInactive: { (status: WorldStatus): boolean };
}

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
