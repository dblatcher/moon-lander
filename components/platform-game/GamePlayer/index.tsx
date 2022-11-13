import React from "react";
import { World } from "physics-worlds";

import FullCanvas from "../../FullCanvas";
import WorldInterface from "../../WorldInterface";
import FollowBodyCanvas from "../../FollowBodyCanvas";
import NumberPanel from "../../NumberPanel";
import Dialogue from "../../Dialogue";
import PausedSymbol from "../../PausedSymbol";

import { GameContainerState } from "../../GameContainer";
import { controlRobot } from "../../../modules/platform-game/controlRobot";
import { GameMode } from "../../../modules/GameMode";
import { WorldStatus, getWorldStatus, getPlayerRobot, getPlayerMotion } from "../../../modules/platform-game/platformGameWorldValues";
import { highlightLandingPad, makeTerrainBlack, spaceShipIsRedCircle, noAreas, highlightRefuelPad } from "../../../modules/minimap";

import styles from "./styles.module.scss";
import dialogueStyles from "../../Dialogue/styles.module.scss";
import RollMeter from "../RollMeter";
import BarMeter from "../../BarMeter";


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function GamePlayer(props: Readonly<{
    world: World
    gameMode: GameMode
    worldStatus: WorldStatus
    score: number
    lives: number
    level: number
    mode: "TITLE" | "PLAY" | "HIGHSCORE" | "INTRO"
    isPaused: boolean
    controls: { [index: string]: boolean }
    handleWorldStatus: { (worldStatus: WorldStatus): void }
    addPoints: { (points: number): Promise<GameContainerState> }
    addLives: { (points: number): Promise<GameContainerState> }
    startLevel: { (level?: number): Promise<GameContainerState> }
    endPlaySession: { (): Promise<GameContainerState> }
}>) {

    const {
        world, worldStatus, level, score, lives, controls, isPaused, mode, gameMode,
        handleWorldStatus, startLevel, addPoints, addLives, endPlaySession
    } = props

    const onLastLevel = (level + 1 > gameMode.numberOfLevels);

    async function advance() {

        const points = 100;

        await addPoints(points)
        await sleep(250);

        if (onLastLevel) {
            await endPlaySession()
        } else {
            await startLevel(level + 1)
        }
    }

    async function retry() {
        await addLives(-1);
        await startLevel();
    }

    return <article className={styles.article}>

        <section className={styles.screensRow}>
            <div className={styles.mainScreen}>
                <div>
                    <FollowBodyCanvas
                        world={world}
                        getSubject={getPlayerRobot}
                        magnify={1}
                        height={1200} width={1200}
                        framefill={'gray'} />
                </div>
            </div>
            <div className={styles.scannerScreen}>
                <FullCanvas
                    world={world}
                    dontRenderBackground
                    backGroundOverride={'transparent'}
                    dontRenderEffects
                    transformRules={[
                        makeTerrainBlack,
                        spaceShipIsRedCircle,
                        highlightLandingPad,
                        noAreas,
                        highlightRefuelPad,
                    ]}
                    magnify={.2} />
            </div>
        </section>

        <section className={styles.panelRow}>
            <NumberPanel gameMode={gameMode}
                score={score}
                level={level}
                lives={lives} />

            <RollMeter world={world} getValues={getPlayerMotion} />
            <BarMeter world={world} meterType={'BIGAGE'} getValues={(world) => {
                const { rolling = 0 } = getPlayerMotion(world) || { rolling: 0 }
                return {
                    max: 3,
                    value: -rolling
                }
            }} />

        </section>

        {(worldStatus.playerLanded && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>You have landed!</p>
                {onLastLevel && <p> Congratulations! That was the last level!</p>}

                <button className={dialogueStyles.button} onClick={advance}>
                    {onLastLevel ? 'Finished...' : 'Go to next level!'}
                </button>
            </Dialogue>
        )}

        {(worldStatus.playerDead && mode === "PLAY") && (
            <Dialogue placement="TOP" design="PLAIN">
                <p>You have died or whatever.</p>

                {lives > 0 ? (
                    <button className={dialogueStyles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={dialogueStyles.button} onClick={() => { endPlaySession() }}>Game Over!</button>
                )}
            </Dialogue>
        )}

        {(isPaused && mode === "PLAY") && (
            <PausedSymbol />
        )}

        <WorldInterface displayInput
            controls={(!worldStatus.playerLanded && mode === "PLAY") ? controls : {}}
            world={world}
            controlFunction={controlRobot}
            getWorldStatus={getWorldStatus}
            reportWorldStatus={handleWorldStatus} />

    </article>
}