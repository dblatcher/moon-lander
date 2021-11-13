import React from "react";
import { World } from "physics-worlds";

import FullCanvas from "./FullCanvas";
import WorldInterface from "./WorldInterface";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";

import { controlSpaceShip } from "../modules/controlSpaceShip";
import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus } from "../modules/worldValues";
import { highlightLandingPad, makeTerrainWhite, spaceShipIsRedCircle } from "../modules/minimap";

import styles from "./MoonLanderGame.module.scss";

import { GameContainerState } from "./GameContainer";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default function MoonLanderGame(props: {
    world: World,
    playerHasLanded: boolean
    playerHasDied: boolean
    score: number
    lives: number
    level: number
    mode: "TITLE" | "PLAY" | "HIGHSCORE"
    isPaused: boolean
    controls: { [index: string]: boolean }
    handleWorldStatus: { (worldStatus: WorldStatus): void }
    addPoints: { (points: number): Promise<GameContainerState> }
    addLives: { (points: number): Promise<GameContainerState> }
    startLevel: { (level?: number): Promise<GameContainerState> }
    goToTitles: { (): Promise<GameContainerState> }
    goToHighScore: { (): Promise<GameContainerState> }
}) {

    const {
        world, playerHasLanded, level, score, lives, controls, playerHasDied, isPaused, mode,
        handleWorldStatus, startLevel, addPoints, addLives, goToTitles, goToHighScore
    } = props


    async function advance() {
        const fuelLeft = getPlayerFuel(world)?.value;
        const points = fuelLeft ? Math.floor(fuelLeft / 50) : 0;
        await addPoints(points)
        await sleep(1000);
        await startLevel(level + 1)
    }

    async function retry() {
        await addLives(-1);
        await startLevel();
    }

    async function endSession() {
        if (score > 0) {
            return goToHighScore()
        }
        return goToTitles()
    }

    return <article className={styles.article}>
        <p className={styles.numberPanel}>
            <span>level: {level}</span>
            <span>score: {score}</span>
            <span>lives: {lives}</span>
        </p>
        <div className={styles.mainScreen}>
            <div>
                <FollowBodyCanvas
                    world={world}
                    magnify={1}
                    height={1200} width={1200}
                    framefill={'gray'} />
            </div>
        </div>

        <div className={[styles.panel, styles["panel--metal"]].join(" ")}>

            <div className={styles.lcd}>
                <FullCanvas
                    world={world}
                    dontRenderBackground
                    dontRenderEffects
                    transformRules={[
                        makeTerrainWhite,
                        spaceShipIsRedCircle,
                        highlightLandingPad,
                    ]}
                    magnify={.2} />
            </div>
            <span className={styles["bottom-rivets"]}></span>
        </div>

        <div className={[styles.panel, styles["panel--left"], styles["panel--metal"]].join(" ")}>
            <div className={styles.row}>
                <BarMeter
                    world={world}
                    getValues={getPlayerThrust} />
                <BarMeter
                    meterType="GAGE"
                    world={world}
                    getValues={getPlayerFuel} />
            </div>
            <span className={styles["bottom-rivets"]}></span>
        </div>

        {(playerHasLanded && mode === "PLAY") && (
            <article className={styles.dialogue}>
                <p>You have landed!</p>
                <button className={styles.button} onClick={advance}>Go to next level!</button>
            </article>
        )}

        {(playerHasDied && mode === "PLAY") && (
            <article className={styles.dialogue}>
                <p>You have crashed.</p>

                {lives > 0 ? (
                    <button className={styles.button} onClick={retry}>Try again....</button>
                ) : (
                    <button className={styles.button} onClick={() => { endSession() }}>Game Over!</button>
                )}
            </article>
        )}

        {(isPaused && mode === "PLAY") && (
            <article className={styles.dialogue}>
                <p>PAUSED</p>
            </article>
        )}

        <WorldInterface
            controls={(!playerHasLanded && mode === "PLAY") ? controls : {}}
            world={world}
            controlFunction={controlSpaceShip}
            getWorldStatus={getWorldStatus}
            reportWorldStatus={handleWorldStatus} />

    </article>
}