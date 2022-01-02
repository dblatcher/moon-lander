import React from "react";
import MoonLanderGame from "./MoonLanderGame";
import MoonLanderTitleScreen from "./MoonLanderTitleScreen";
import HighScoreEntry from "./HighScoreEntry";
import KeyReader from "./KeyReader";
import styles from "./GameContainer.module.scss";

import { SoundPlayer, World } from "physics-worlds";

import { WorldStatus } from "../modules/worldValues";
import { ScoreData } from "../modules/data-access/ScoreData";
import { GameMode } from "../modules/GameMode";
import { LevelIntro } from "../modules/LevelIntro";
import MoonLanderLevelIntro from "./MoonLanderLevelIntro";
import { makeSoundDeck } from "../audio";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

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
    playerHasLanded: boolean  // should wrap these properies into a WorldStatus prop to 
    playerIsStranded: boolean // the generalise and simplify this component
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
    soundPlayer?: SoundPlayer

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
            playerIsStranded: false,
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
        this.asyncSetState = this.asyncSetState.bind(this)
    }

    componentWillUnmount() {
        this.tearDownWorld()
    }

    tearDownWorld() {
        this.world?.stopTime();
        this.world?.soundDeck?.mute()
        this.world = undefined;
        this.soundPlayer = undefined;
    }

    async asyncSetState(modification: Partial<GameContainerState>): Promise<GameContainerState> {
        return new Promise(resolve => {
            this.setState(modification, () => { resolve(this.state) })
        })
    }

    handleCommandPress(command: string) {
        const { mode } = this.state;
        const { startingLives, speed } = this.props.gameMode;
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
                    if (this.world) {
                        this.world.ticksPerSecond = speed;
                    }
                    this.setState({
                        mode: "PLAY"
                    })
                }
                break;

            case "PAUSE":
                this.togglePaused();
                break;
        }
    }

    handleWorldStatus(status: WorldStatus): void {
        const { landingPadPlayerIsOn, playerDead, playerStranded } = status;
        const modification: any = {}

        if (!this.state.playerHasDied && playerDead) {
            modification.playerHasDied = true
        }

        if (!this.state.playerHasLanded && landingPadPlayerIsOn && landingPadPlayerIsOn.typeId == "LandingPad") {
            modification.playerHasLanded = true
        }

        if (!this.state.playerIsStranded && playerStranded) {
            modification.playerIsStranded = true
        }

        this.setState(modification)
    }

    togglePaused(): void {
        if (!this.world) { return }
        const { mode, playerHasDied, playerHasLanded, playerIsStranded } = this.state
        const { speed } = this.props.gameMode;
        if (mode !== "PLAY" || playerHasDied || playerHasLanded || playerIsStranded) { return }

        this.world.ticksPerSecond = this.world.ticksPerSecond ? 0 : speed;
        this.forceUpdate();
    }

    get isPaused(): boolean {
        return this.world ? this.world.ticksPerSecond === 0 : false;
    }

    async startLevel(levelNumber?: number): Promise<GameContainerState> {
        const { numberOfLevels, makeLevel, speed } = this.props.gameMode;

        if (typeof levelNumber === "undefined") { levelNumber = this.state.level }
        levelNumber = levelNumber > numberOfLevels ? 1 : levelNumber;

        this.tearDownWorld();
        const [newWorld, levelIntro] = await makeLevel(levelNumber);
        this.world = newWorld;
        this.world.soundDeck = makeSoundDeck()

        await this.asyncSetState({
            mode: levelIntro ? "INTRO" : "PLAY",
            level: levelNumber,
            levelIntro,
            playerHasLanded: false,
            playerHasDied: false,
            playerIsStranded: false,
        })

        if (!levelIntro) {
            newWorld.ticksPerSecond = speed;
        }

        return this.state
    }

    async endPlaySession(): Promise<GameContainerState> {
        const { isDataBase, gameMode } = this.props;
        const { score } = this.state;

        if (!gameMode.noScores && isDataBase && score > 0) {
            return this.goToHighScore()
        }

        return this.goToTitles();
    }

    async goToHighScore(): Promise<GameContainerState> {
        await this.asyncSetState({
            mode: "HIGHSCORE",
            playerHasLanded: false,
            playerHasDied: false,
            playerIsStranded: false,
        })

        return this.state
    }

    async goToTitles(): Promise<GameContainerState> {
        this.tearDownWorld()

        await this.asyncSetState({
            level: 1,
            lives: this.props.gameMode.startingLives,
            playerHasLanded: false,
            playerHasDied: false,
            playerIsStranded: false,
            score: 0,
            mode: "TITLE"
        })

        return this.state;
    }

    async addPoints(amount: number): Promise<GameContainerState> {
        const { gameMode } = this.props;
        if (gameMode.noScores) { return this.state }

        await this.asyncSetState({
            score: this.state.score + amount
        })
        return this.state
    }

    async addLives(amount: number): Promise<GameContainerState> {
        await this.asyncSetState({
            lives: this.state.lives + amount
        })
        return this.state
    }

    render() {
        const { scoreData, isDataBase, gameMode } = this.props;
        const { controls, playerHasLanded, playerHasDied, playerIsStranded, score, lives, mode, level, levelIntro } = this.state;
        const { world } = this;

        const soundEnabled = world?.soundDeck?.isEnabled;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                {(mode === "TITLE") &&
                    <MoonLanderTitleScreen
                        showHighScores={!gameMode.noScores && isDataBase}
                        scoreData={scoreData}
                        title={gameMode.title} />
                }

                {(!!world && (mode === "PLAY" || mode === "HIGHSCORE" || mode === "INTRO")) &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        gameMode={gameMode}
                        playerHasDied={playerHasDied}
                        playerIsStranded={playerIsStranded}
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

                {(mode !== "TITLE") &&
                    <div className={styles.menuBar}>
                        <button onClick={this.togglePaused}>Pause</button>

                        <button disabled={true}
                            onClick={() => {  }}
                        >{soundEnabled ? 'sound is on' : 'sound is off'}</button>

                        {gameMode.allowRestart && <button onClick={() => { this.startLevel() }}>Restart Level</button>}
                        {gameMode.allowSkip && <button onClick={() => { this.startLevel(level + 1) }}>Skip Level</button>}
                        <button onClick={() => { this.endPlaySession() }}>Quit</button>
                    </div>
                }
            </main>
        )
    }
}

