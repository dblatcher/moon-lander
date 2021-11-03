import { AbstractGradientFill, RenderTransformationRule, ViewPort, World, } from "physics-worlds";
import React, { useEffect, useRef } from "react";

export default function FullCanvas(props: {
    world: World
    magnify?: number
    transformRules?: RenderTransformationRule[]
    dontRenderBackground?: boolean
    framefill?: string | AbstractGradientFill
}) {
    const { world, magnify = 1, transformRules = [], dontRenderBackground, framefill } = props
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const viewPort = useRef<ViewPort | null>(null)

    useEffect(() => {
        if (canvas.current && !viewPort.current) {
            viewPort.current = ViewPort.full(world, canvas.current, magnify)
            viewPort.current.transformRules = transformRules;
            if (framefill) { viewPort.current.framefill = framefill }
            if (dontRenderBackground) { viewPort.current.dontRenderBackground = true }
        }

    }, [world])

    return <canvas ref={canvas}></canvas>
}
