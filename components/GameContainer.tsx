import React from "react";
import { World } from "physics-worlds";
import FullCanvas from "./FullCanvas";
import styles from "./GameContainer.module.scss";
import KeyReader from "./KeyReader";
import WorldInterface from "./WorldInterface";

import { makeWorld } from "../modules/worldFactory";
import { getPlayerFuel, getPlayerThrust, WorldStatus, getWorldStatus } from "../modules/worldValues";
import { controlSpaceShip } from "../modules/controlSpaceShip";
import FollowBodyCanvas from "./FollowBodyCanvas";
import BarMeter from "./BarMeter";

const SPEED = 50;

const controlMapping: { [index: string]: string } = {
    "w": "up",
    "ArrowUp": "up",
    "a": "left",
    "ArrowLeft": "left",
    "d": "right",
    "ArrowRight": "right",
    "s": "down",
    "ArrowDown": "down"
}

export default class GameContainer extends React.Component {
    props!: {
        title: string
    };
    state!: {
        world: World
        worldCreationTimeStamp: number
        controls: { [index: string]: boolean }
        playerHasLanded: boolean
        playerHasDied: boolean
    };
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: GameContainer["props"]) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            world: makeWorld(),
            worldCreationTimeStamp: Date.now(),
            controls: {},
            playerHasLanded: false,
            playerHasDied: false,
        }

        this.state.world.ticksPerSecond = SPEED
        this.togglePaused = this.togglePaused.bind(this)
        this.handleWorldStatus = this.handleWorldStatus.bind(this)
        this.reset = this.reset.bind(this)
    }

    handleWorldStatus(status: WorldStatus) {
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

    togglePaused() {
        // eslint-disable-next-line react/no-direct-mutation-state
        this.state.world.ticksPerSecond = this.state.world.ticksPerSecond ? 0 : SPEED
    }

    reset() {
        const newWorld = makeWorld();
        newWorld.ticksPerSecond = SPEED;
        this.setState({
            world: newWorld,
            worldCreationTimeStamp: Date.now(),
            playerHasLanded: false,
            playerHasDied: false,
        })
    }


    render() {
        const { title } = this.props;
        const { controls, world, worldCreationTimeStamp, playerHasLanded, playerHasDied } = this.state;


        return (
            <main className={styles.component}>

                <h2>{title}</h2>
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={this.reset}>reset</button>
                </div>
                <div>
                    <span>{playerHasLanded ? 'landed!' : 'not landed...'}</span>
                    <span>{playerHasDied ? ' CRASHED!' : ' operational...'}</span>
                </div>

                <div className={styles.row}>
                    <BarMeter world={world} getValues={getPlayerThrust} />
                    <BarMeter meterType="GAGE" world={world} getValues={getPlayerFuel} />

                    <FollowBodyCanvas
                        key={"A" + worldCreationTimeStamp}
                        world={world}
                        magnify={.8}
                        height={500} width={500}
                        framefill={'white'}
                    />
                    <FullCanvas key={"B" + worldCreationTimeStamp} world={world} magnify={.2} />
                </div>

                <KeyReader
                    report={(controls: { [index: string]: boolean }) => { this.setState({ controls }) }}
                    controlMapping={controlMapping}
                />

                <WorldInterface
                    controls={controls}
                    world={world}
                    controlFunction={controlSpaceShip}
                    getWorldStatus={getWorldStatus}
                    reportWorldStatus={this.handleWorldStatus}
                    key={"C" + worldCreationTimeStamp}
                />

            </main>
        )
    }
}