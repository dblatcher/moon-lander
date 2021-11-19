import React from "react";
import { World } from "physics-worlds";
import styles from "./GameContainer.module.scss";
import KeyReader from "./KeyReader";

import { makeWorld, numberOfLevels } from "../modules/world-factory";
import { WorldStatus } from "../modules/worldValues";
import MoonLanderGame from "./MoonLanderGame";
import MoonLanderTitleScreen from "./MoonLanderTitleScreen";
import { ScoreData } from "../modules/ScoreData";
import HighScoreEntry from "./HighScoreEntry";

const SPEED = 50;

const STARTING_LIVES = 1;

const controlMapping: { [index: string]: string } = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "ArrowDown": "down",
    " ": "START",
    "p": "PAUSE",
    "P": "PAUSE",
}

interface GameContainerState {
    level: number
    score: number
    lives: number,
    controls: { [index: string]: boolean }
    playerHasLanded: boolean
    playerHasDied: boolean
    mode: "TITLE" | "PLAY" | "HIGHSCORE"
}

export type { GameContainerState }

export default class GameContainer extends React.Component {
    props!: {
        title?: string
        scoreData?: ScoreData
    };
    state!: GameContainerState;
    canvasRef: React.RefObject<HTMLCanvasElement>;
    world?: World

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            level: 1,
            score: 0,
            lives: STARTING_LIVES,
            controls: {},
            playerHasLanded: false,
            playerHasDied: false,
            mode: "TITLE",
        }

        this.togglePaused = this.togglePaused.bind(this)
        this.handleWorldStatus = this.handleWorldStatus.bind(this)
        this.addPoints = this.addPoints.bind(this)
        this.addLives = this.addLives.bind(this)
        this.startLevel = this.startLevel.bind(this)
        this.goToTitles = this.goToTitles.bind(this)
        this.goToHighScore = this.goToHighScore.bind(this)
        this.handleCommandPress = this.handleCommandPress.bind(this)
    }

    handleCommandPress(command: string) {
        const { mode, playerHasDied, playerHasLanded } = this.state;


        switch (command) {
            case "START":
                if (mode !== "TITLE") { return }

                this.setState({
                    mode: "PLAY",
                    level: 1,
                    lives: STARTING_LIVES,
                    score: 0,
                }, () => {
                    this.startLevel();
                })
                break;

            case "PAUSE":
                if (mode !== "PLAY" || playerHasDied || playerHasLanded) { return }
                this.togglePaused();
                break;
        }

    }

    handleWorldStatus(status: WorldStatus): void {
        const { landingPadPlayerIsOn, playerDead } = status;
        const modification: any = {}

        if (!this.state.playerHasDied && playerDead) {
            modification.playerHasDied = true
        }

        if (!this.state.playerHasLanded && landingPadPlayerIsOn) {
            modification.playerHasLanded = true
        }

        this.setState(modification)
    }

    togglePaused(): void {
        if (!this.world) { return }
        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : SPEED
    }

    get isPaused(): boolean {
        return this.world ? this.world.ticksPerSecond === 0 : false;
    }

    startLevel(levelNumber?: number): Promise<GameContainerState> {
        if (typeof levelNumber === "undefined") { levelNumber = this.state.level }
        levelNumber = levelNumber > numberOfLevels ? 1 : levelNumber;

        return new Promise(resolve => {
            this.world?.stopTime();
            const newWorld = makeWorld(levelNumber);
            newWorld.ticksPerSecond = SPEED;
            this.world = newWorld;

            this.setState({
                mode: "PLAY",
                level: levelNumber,
                playerHasLanded: false,
                playerHasDied: false,
            }, () => {
                resolve(this.state)
            })
        })
    }

    goToHighScore(): Promise<GameContainerState> {
        return new Promise(resolve => {
            this.setState({
                mode: "HIGHSCORE",
                playerHasLanded: false,
                playerHasDied: false,
            }, () => {
                resolve(this.state)
            })
        })
    }

    goToTitles(): Promise<GameContainerState> {

        return new Promise(resolve => {
            this.world?.stopTime();
            this.world = undefined;
            this.setState({
                level: 1,
                lives: STARTING_LIVES,
                playerHasLanded: false,
                playerHasDied: false,
                score: 0,
                mode: "TITLE"
            }, () => {
                resolve(this.state)
            })
        })

    }

    addPoints(amount: number): Promise<GameContainerState> {
        return new Promise(resolve => {
            this.setState({ score: this.state.score + amount }, () => { resolve(this.state) })
        })
    }

    addLives(amount: number): Promise<GameContainerState> {
        return new Promise(resolve => {
            this.setState({ lives: this.state.lives + amount }, () => { resolve(this.state) })
        })
    }

    render() {
        const { title, scoreData } = this.props;
        const { controls, playerHasLanded, playerHasDied, score, lives, mode, level } = this.state;
        const { world } = this;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                {title && <h2>{title}</h2>}
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={() => { this.startLevel() }}>restart</button>
                    <button onClick={() => { this.startLevel(level + 1) }}>skip</button>
                    <button onClick={() => { this.goToTitles() }}>quit</button>
                    <button onClick={() => { this.goToHighScore() }}>quit to highscores</button>
                </div>


                {(mode === "TITLE") &&
                    <MoonLanderTitleScreen scoreData={scoreData} />
                }

                {(!!world && (mode === "PLAY" || mode === "HIGHSCORE")) &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        playerHasDied={playerHasDied}
                        playerHasLanded={playerHasLanded}
                        controls={controls}
                        score={score}
                        mode={mode}
                        lives={lives}
                        level={level}
                        isPaused={this.isPaused}
                        handleWorldStatus={this.handleWorldStatus}
                        addPoints={this.addPoints}
                        addLives={this.addLives}
                        startLevel={this.startLevel}
                        goToTitles={this.goToTitles}
                        goToHighScore={this.goToHighScore}
                    />
                }

                {(mode === "HIGHSCORE") &&
                    <HighScoreEntry score={score} exit={this.goToTitles} />
                }

                <KeyReader
                    report={(controls: { [index: string]: boolean }) => { this.setState({ controls }) }}
                    reportPress={(command: string) => { this.handleCommandPress(command) }}
                    controlMapping={controlMapping} />
            </main>
        )
    }
}

