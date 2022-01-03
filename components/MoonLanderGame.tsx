import React from "react";
import { World } from "physics-worlds";

import FullCanvas from "./FullCanvas";
import WorldInterface from "./WorldInterface";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";
import DangerMeter from "./DangerMeter";
import NumberPanel from "./NumberPanel";
import Dialogue from "./Dialogue";
import PausedSymbol from "./PausedSymbol";

import { GameContainerState } from "./GameContainer";
import { controlSpaceShip } from "../modules/controlSpaceShip";
import { GameMode } from "../modules/GameMode";
import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus, getPlayerSpeed } from "../modules/worldValues";
import { highlightLandingPad, makeTerrainBlack, spaceShipIsRedCircle, noAreas, highlightRefuelPad } from "../modules/minimap";

import styles from "./MoonLanderGame.module.scss";
import dialogueStyles from "./Dialogue/styles.module.scss";


function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function MoonLanderGame(props: Readonly<{
    world: World
    gameMode: GameMode
    playerHasLanded: boolean
    playerHasDied: boolean
    playerIsStranded: boolean
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
        world, playerHasLanded, level, score, lives, controls, playerHasDied, playerIsStranded, isPaused, mode, gameMode,
        handleWorldStatus, startLevel, addPoints, addLives, endPlaySession
    } = props

    const onLastLevel = (level + 1 > gameMode.numberOfLevels);

    async function advance() {
        const fuelLeft = getPlayerFuel(world)?.value;
        const points = (fuelLeft ? Math.floor(fuelLeft / 50) : 0) + (onLastLevel ? 100 : 50);

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

        <NumberPanel gameMode={gameMode} score={score} level={level} lives={lives} />

        <div className={styles.mainScreen}>
            <div>
                <FollowBodyCanvas
                    world={world}
                    magnify={1}
                    height={1200} width={1200}
                    framefill={'gray'} />
            </div>
        </div>

        <div className={styles.panel}>

            <div className={styles.floatingLcd}>
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
        </div>

        <div className={[styles.panel, styles["panel--left"], styles["panel--metal"]].join(" ")}>
            <div className={styles.row}>
                <BarMeter
                    caption="THRUST"
                    world={world}
                    getValues={getPlayerThrust} />
                <BarMeter
                    caption="FUEL"
                    meterType="GAGE"
                    world={world}
                    getValues={getPlayerFuel} />
                <DangerMeter
                    caption="SPEED"
                    world={world}
                    getValues={getPlayerSpeed} />
            </div>
            <span className={styles["bottom-rivets"]}></span>
        </div>

        {(playerHasLanded && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>You have landed!</p>
                {onLastLevel && <p> Congratulations! That was the last level!</p>}

                <button className={dialogueStyles.button} onClick={advance}>
                    {onLastLevel ? 'Finished...' : 'Go to next level!'}
                </button>
            </Dialogue>
        )}

        {(playerHasDied && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>You have crashed.</p>

                {lives > 0 ? (
                    <button className={dialogueStyles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={dialogueStyles.button} onClick={() => { endPlaySession() }}>Game Over!</button>
                )}
            </Dialogue>
        )}

        {(playerIsStranded && !playerHasLanded && mode === "PLAY") && (
            <Dialogue placement="TOP" design="YELLOW">
                <p>You have ran out of fuel.</p>

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

        <WorldInterface
            controls={(!playerHasLanded && mode === "PLAY") ? controls : {}}
            world={world}
            controlFunction={controlSpaceShip}
            getWorldStatus={getWorldStatus}
            reportWorldStatus={handleWorldStatus} />

    </article>
}