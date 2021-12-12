import React from "react";
import MoonLanderGame from "./MoonLanderGame";
import MoonLanderTitleScreen from "./MoonLanderTitleScreen";
import HighScoreEntry from "./HighScoreEntry";
import KeyReader from "./KeyReader";
import styles from "./GameContainer.module.scss";

import { World } from "physics-worlds";

import { WorldStatus } from "../modules/worldValues";
import { ScoreData } from "../modules/data-access/ScoreData";
import { GameMode } from "../modules/GameMode";
import { LevelIntro } from "../modules/LevelIntro";
import MoonLanderLevelIntro from "./MoonLanderLevelIntro";



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
    mode: "TITLE" | "PLAY" | "HIGHSCORE" | "INTRO"
    levelIntro?: LevelIntro
}

export type { GameContainerState }

export default class GameContainer extends React.Component {
    props!: {
        scoreData?: ScoreData
        isDataBase: boolean
        gameMode: GameMode
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
            lives: props.gameMode.startingLives,
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
        this.endPlaySession = this.endPlaySession.bind(this)
        this.goToTitles = this.goToTitles.bind(this)
        this.handleCommandPress = this.handleCommandPress.bind(this)
    }

    componentWillUnmount() {
        this.world = undefined;
    }

    handleCommandPress(command: string) {
        const { mode, playerHasDied, playerHasLanded } = this.state;
        const { startingLives } = this.props.gameMode;
        switch (command) {
            case "START":
                if (mode == "TITLE") {

                    this.setState({
                        mode: "PLAY",
                        level: 1,
                        lives: startingLives,
                        score: 0,
                    }, () => {
                        this.startLevel();
                    })
                } else if (mode == "INTRO") {
                    if (this.isPaused) {this.togglePaused()}
                    this.setState({
                        mode: "PLAY"
                    })
                }
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
        const { speed } = this.props.gameMode;
        if (!this.world) { return }
        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : speed
    }

    get isPaused(): boolean {
        return this.world ? this.world.ticksPerSecond === 0 : false;
    }

    startLevel(levelNumber?: number): Promise<GameContainerState> {
        const { numberOfLevels, makeLevel } = this.props.gameMode;
        const { speed } = this.props.gameMode;
        if (typeof levelNumber === "undefined") { levelNumber = this.state.level }
        levelNumber = levelNumber > numberOfLevels ? 1 : levelNumber;

        return new Promise(resolve => {
            this.world?.stopTime();
            const [newWorld, levelIntro] = makeLevel(levelNumber);

            this.world = newWorld;
            this.world.tick()

            this.setState({
                mode: levelIntro ? "INTRO" : "PLAY",
                level: levelNumber,
                levelIntro,
                playerHasLanded: false,
                playerHasDied: false,
            }, () => {

                if (levelIntro) {
                    console.log(levelIntro.title)
                } else {
                    newWorld.ticksPerSecond = speed;
                }
    

                resolve(this.state)
            })
        })
    }

    endPlaySession(): Promise<GameContainerState> {
        const { isDataBase } = this.props;
        const { score } = this.state;

        if (isDataBase && score > 0) {
            return this.goToHighScore()
        }

        return this.goToTitles();
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
                lives: this.props.gameMode.startingLives,
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
        const { scoreData, isDataBase } = this.props;
        const { numberOfLevels, title } = this.props.gameMode;
        const { controls, playerHasLanded, playerHasDied, score, lives, mode, level, levelIntro } = this.state;
        const { world } = this;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={() => { this.startLevel() }}>restart</button>
                    <button onClick={() => { this.startLevel(level + 1) }}>skip</button>
                    <button onClick={() => { this.endPlaySession() }}>end session</button>
                </div>


                {(mode === "TITLE") &&
                    <MoonLanderTitleScreen scoreData={scoreData} isDataBase={isDataBase} title={title} />
                }

                {(!!world && (mode === "PLAY" || mode === "HIGHSCORE" || mode === "INTRO")) &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        playerHasDied={playerHasDied}
                        playerHasLanded={playerHasLanded}
                        controls={controls}
                        score={score}
                        mode={mode}
                        lives={lives}
                        level={level}
                        numberOfLevels={numberOfLevels}
                        isPaused={this.isPaused}
                        handleWorldStatus={this.handleWorldStatus}
                        addPoints={this.addPoints}
                        addLives={this.addLives}
                        startLevel={this.startLevel}
                        endPlaySession={this.endPlaySession}
                    />
                }

                {(mode === "INTRO") &&
                    <MoonLanderLevelIntro levelIntro={levelIntro} />
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

