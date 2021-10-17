import React from "react";
import react from "react";
import { World } from "physics-worlds";
import { Command, makeWorld, respondToCommand } from "../modules/worldFactory";
import Controls from "./Controls";
import FullCanvas from "./FullCanvas";
import styles from "./GameContainer.module.scss";

interface GameContainerProps {
    title: string
}

interface GameContainerState {
    world: World
    worldCreationTimeStamp: number
}

export type { GameContainerProps }

export default class GameContainer extends react.Component {
    props!: GameContainerProps;
    state!: GameContainerState;
    canvasRef: React.RefObject<HTMLCanvasElement>;

    constructor(props: GameContainerProps) {
        super(props);
        this.canvasRef = React.createRef();

        this.state = {
            world: makeWorld(),
            worldCreationTimeStamp: Date.now(),
        }


        this.state.world.ticksPerSecond = 50
        this.togglePaused = this.togglePaused.bind(this)
        this.reset = this.reset.bind(this)
        this.handleInput = this.handleInput.bind(this)
    }

    togglePaused() {
        this.state.world.ticksPerSecond = this.state.world.ticksPerSecond ? 0 : 50
    }

    reset() {
        const newWorld = makeWorld();
        newWorld.ticksPerSecond = 50;
        this.setState({ 
            world: newWorld,
            worldCreationTimeStamp: Date.now(),
        })
    }

    handleInput(key: Command) {
        return respondToCommand(this.state.world, key);
    }

    render() {
        const { title } = this.props;

        return (
            <main className={styles.component}>

                <h2>{title}</h2>
                <div>
                    <button onClick={this.togglePaused}>pause</button>
                    <button onClick={this.reset}>reset</button>
                </div>
                <FullCanvas key={"A"+this.state.worldCreationTimeStamp} world={this.state.world} />
                <FullCanvas key={"B"+this.state.worldCreationTimeStamp} world={this.state.world} magnify={.2}/>
                <Controls handleInput={this.handleInput} />
            </main>
        )
    }
}