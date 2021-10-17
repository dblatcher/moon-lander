import { ViewPort, World } from "physics-worlds";
import React from "react";


interface FullCanvasProps {
    world: World
    magnify?: number
}

interface FullCanvasState {
    viewPort?: ViewPort
}

export type { FullCanvasProps };

export default class FullCanvas extends React.Component {
    props!: FullCanvasProps
    state!: FullCanvasState
    canvasRef: React.RefObject<HTMLCanvasElement>;


    constructor(props: FullCanvasProps) {
        super(props);
        this.state = {
            viewPort: undefined
        }
        this.canvasRef = React.createRef();

        this.createViewPort = this.createViewPort.bind(this);
    }


    createViewPort():void {
        const { world, magnify = 1 } = this.props
        const canvas = this.canvasRef.current

        if (canvas) {
            this.setState({
                viewPort: ViewPort.full(world, canvas, magnify)
            })
        } else {
            console.log('no canvas!')
        }
    }

    componentDidMount() {
        this.createViewPort()
    }

    render() {
        return <canvas ref={this.canvasRef}></canvas>
    }
}