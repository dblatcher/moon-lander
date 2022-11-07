import React from "react";
import MoonLanderGame from "../../MoonLanderGame";
import HighScoreEntry from "../../HighScoreEntry";
import KeyReader from "../../KeyReader";
import styles from "./GameContainer.module.scss";

import { SoundDeck, World } from "physics-worlds";

import { isChangeToFailure, isChangeToVictory, playerIsInactive, WorldStatus } from "../../../modules/moonLanderWorldValues";
import { ScoreData } from "../../../modules/data-access/ScoreData";
import { GameMode } from "../../../modules/GameMode";
import { LevelIntro } from "../../../modules/LevelIntro";

import { makeSoundDeck, playFailSong, playVictorySong } from "./audio";
import OnScreenControls from "../../OnScreenControls";
import CommandMenu from "../../CommandMenu";
import TitleScreen from "../TitleScreen";
import IntroDialogue from "../IntroDialogue";


export type Command = 'START' | 'PAUSE' | 'QUIT' | 'SOUNDTOGGLE' | 'CONTROLTOGGLE' | 'RESTARTLEVEL' | 'SKIPLEVEL'

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
    "O": "CONTROLTOGGLE",
    "o": "CONTROLTOGGLE",
}

interface GameContainerState {
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
    songPlaying?: Promise<boolean>

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            level: 1,
            score: 0,
            lives: props.gameMode.startingLives,
            keyBoardControlInput: {},
            onScreenControlInput: {},
            worldStatus: {},
            mode: "TITLE",
            soundEnabled: true,
            showOnScreenControls: false,
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
        this.setSoundEnabled = this.setSoundEnabled.bind(this)
    }

    componentWillUnmount() {
        this.tearDownWorld()
    }

    tearDownWorld() {
        this.world?.stopTime();
        this.world?.soundDeck?.mute()
        this.world = undefined;
    }

    get controls() {
        const { keyBoardControlInput, onScreenControlInput, } = this.state

        const controls: { [index: string]: true } = {};
        Object.keys(keyBoardControlInput).forEach(key => {
            if (keyBoardControlInput[key] === true) { controls[key] = true }
        })
        Object.keys(onScreenControlInput).forEach(key => {
            if (onScreenControlInput[key] === true) { controls[key] = true }
        })

        return controls
    }

    setSoundEnabled(value: boolean, ignorePauseState = false): Promise<GameContainerState> {
        return this.asyncSetState({ soundEnabled: value }).then(state => {
            if (this.world?.soundDeck) {
                this.world.soundDeck.masterVolume = state.soundEnabled ? 1 : 0;
                if (this.isPaused && !ignorePauseState) {
                    this.world.soundDeck.mute()
                }
            }
            return state
        })
    }

    async asyncSetState(modification: Partial<GameContainerState>): Promise<GameContainerState> {
        return new Promise(resolve => {
            this.setState(modification, () => { resolve(this.state) })
        })
    }

    handleCommandPress(command: Command) {
        const { mode, soundEnabled, showOnScreenControls, level } = this.state;
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

            case "QUIT":
                this.endPlaySession()
                break;

            case "SOUNDTOGGLE":
                this.setSoundEnabled(!soundEnabled)
                break;

            case "CONTROLTOGGLE":
                this.setState({ showOnScreenControls: !showOnScreenControls })
                break;

            case "RESTARTLEVEL":
                this.startLevel()
                break;

            case "SKIPLEVEL":
                this.startLevel(level + 1)
                break;

        }
    }

    unlessSongAlreadyPlaying(songFunction: { (deck?: SoundDeck): Promise<boolean> }) {
        if (!this.songPlaying) {
            this.songPlaying = songFunction(this.world?.soundDeck);
            this.songPlaying.then(() => {
                this.songPlaying = undefined;
            })
        }
    }

    handleWorldStatus(status: WorldStatus): void {
        const { worldStatus: oldStatus } = this.state;

        if (isChangeToVictory(oldStatus, status)) {
            this.unlessSongAlreadyPlaying(playVictorySong)
        }

        if (isChangeToFailure(oldStatus, status)) {
            this.unlessSongAlreadyPlaying(playFailSong)
        }

        const newStatus: WorldStatus = {
            playerDead: oldStatus.playerDead || status.playerDead,
            playerStranded: oldStatus.playerLanded || status.playerLanded,
            playerLanded: oldStatus.playerLanded || status.playerLanded,
        }

        this.setState({ worldStatus: newStatus })
    }

    togglePaused(): void {
        if (!this.world) { return }
        const { mode, worldStatus } = this.state
        const { speed } = this.props.gameMode;
        if (mode !== "PLAY" || playerIsInactive(worldStatus)) { return }

        if (this.isPaused) {
            this.world.ticksPerSecond = speed;
            if (this.state.soundEnabled) { this.world.soundDeck?.unmute() }
        } else {
            this.world.ticksPerSecond = 0;
            this.world.soundDeck?.mute()
        }

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

        await this.setSoundEnabled(this.state.soundEnabled, true);

        await this.asyncSetState({
            mode: levelIntro ? "INTRO" : "PLAY",
            level: levelNumber,
            levelIntro,
            worldStatus: {},
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
            worldStatus: {},
        })

        return this.state
    }

    async goToTitles(): Promise<GameContainerState> {
        this.tearDownWorld()

        await this.asyncSetState({
            level: 1,
            lives: this.props.gameMode.startingLives,
            worldStatus: {},
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
        const { worldStatus, score, lives, mode, level, levelIntro, soundEnabled, showOnScreenControls } = this.state;
        const { world, controls, handleCommandPress } = this;

        return (
            <main className={styles.component} key={world?.name || "no_world"}>

                {(mode === "TITLE") &&
                    <TitleScreen
                        showHighScores={!gameMode.noScores && isDataBase}
                        issueCommand={handleCommandPress}
                        soundEnabled={soundEnabled}
                        showOnScreenControls={showOnScreenControls}
                        scoreData={scoreData}
                        title={gameMode.title} />
                }

                {(!!world && (mode === "PLAY" || mode === "HIGHSCORE" || mode === "INTRO")) &&
                    <MoonLanderGame key={world.name}
                        world={world}
                        gameMode={gameMode}
                        worldStatus={worldStatus}
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
                    <IntroDialogue levelIntro={levelIntro} />
                }

                {(mode === "HIGHSCORE") &&
                    <HighScoreEntry score={score} exit={this.goToTitles} />
                }

                <KeyReader
                    report={(keyBoardControlInput: { [index: string]: boolean }) => { this.setState({ keyBoardControlInput }) }}
                    issueCommand={handleCommandPress}
                    controlMapping={controlMapping} />

                {(showOnScreenControls && mode !== "TITLE") &&
                    <OnScreenControls
                        report={(onScreenControlInput: { [index: string]: boolean }) => { this.setState({ onScreenControlInput }) }}
                        issueCommand={handleCommandPress}
                        directionButtons={['left', 'right', 'up', 'down']}
                        commandButtons={['PAUSE', 'START']}
                    />
                }

                {(mode !== "TITLE") &&
                    <CommandMenu 
                    gameMode={gameMode} 
                    isPaused={this.isPaused}
                    issueCommand={handleCommandPress} 
                    soundEnabled={soundEnabled} 
                    showOnScreenControls={showOnScreenControls} />
                }
            </main>
        )
    }
}

