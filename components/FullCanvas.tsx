import { ViewPort, World } from "physics-worlds";
import React, { useEffect, useRef } from "react";

export default function FullCanvas(props: {
    world: World
    magnify?: number
}) {
    const { world, magnify = 1 } = props
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const viewPort = useRef<ViewPort | null>(null)

    useEffect(() => {
        if (canvas.current && !viewPort.current) {
            viewPort.current = ViewPort.full(world, canvas.current, magnify)
        }
    })

    return <canvas ref={canvas}></canvas>
}
