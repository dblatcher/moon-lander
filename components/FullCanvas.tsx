import { ViewPort, World } from "physics-worlds";
import React from "react";


interface FullCanvasProps {
    world: World
    magnify?: number
}

export type { FullCanvasProps };

export default class FullCanvas extends React.Component {
    props!: FullCanvasProps
    canvasRef: React.RefObject<HTMLCanvasElement>;
    viewPort?: ViewPort

    constructor(props: FullCanvasProps) {
        super(props);
        this.canvasRef = React.createRef();
    }


    componentDidMount() {
        console.log('FullCanvas did mount')
        const { world, magnify = 1 } = this.props
        const canvas = this.canvasRef.current
        if (canvas) {
            this.viewPort = ViewPort.full(world, canvas, magnify);
        } else {
            console.log('no canvas!')
        }
    }

    render() {
        return <canvas ref={this.canvasRef}></canvas>
    }
}