import { Body, World } from "physics-worlds";
import react from "react";
import FullCanvas from "../FullCanvas";


function createTestWorld() {
    const world = new World([
        new Body({ x: 100, y: 100, size: 30, color: 'red' }),
        new Body({ x: 50, y: 50, size: 30, color: 'blue' }),
    ], {
        width: 200,
        height: 200,
        fillColor: 'white',
    })
    world.ticksPerSecond = 10
    return world
}

export default class AnimationCanvas extends react.Component {
    world?: World;
    props!: Readonly<{ 
        children?: react.ReactNode; 
        makeWorld?: { (): World } 
        frameClass?: string
        frameStyle?: react.CSSProperties
    }>;


    constructor(props: AnimationCanvas["props"]) {
        super(props);
    }


    componentDidMount() {
        const { makeWorld } = this.props;
        this.world = makeWorld ? makeWorld() : createTestWorld();
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.world = undefined;
    }


    render(): react.ReactNode {
        const { world } = this;
        const { frameClass, frameStyle={} } = this.props;

        return (
            <div className={frameClass} style={frameStyle}>
                {world ? (
                    <FullCanvas world={world} />
                ):(
                    null
                )}
            </div>
        )
    }
}