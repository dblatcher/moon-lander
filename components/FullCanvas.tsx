import { AbstractFill, RenderTransformationRule, ViewPort, World, } from "physics-worlds";
import React, { useEffect, useRef } from "react";

export default function FullCanvas(props: {
    world: World
    magnify?: number
    transformRules?: RenderTransformationRule[]
    dontRenderBackground?: boolean
    dontRenderEffects?: boolean
    framefill?: string | AbstractFill
    backGroundOverride?: string | AbstractFill
}) {
    const { world, magnify = 1, transformRules = [], dontRenderBackground, dontRenderEffects, framefill, backGroundOverride } = props
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const viewPort = useRef<ViewPort | null>(null)

    useEffect(() => {
        if (canvas.current && !viewPort.current) {
            viewPort.current = ViewPort.full(world, canvas.current, magnify)
            viewPort.current.transformRules = transformRules;
            if (framefill) { viewPort.current.framefill = framefill }
            if (dontRenderBackground) { viewPort.current.dontRenderBackground = true }
            if (dontRenderEffects) { viewPort.current.dontRenderEffects = true }
            if (backGroundOverride) { viewPort.current.backGroundOverride = backGroundOverride }
            viewPort.current.renderCanvas()
        }
    }, [world])

    return <canvas ref={canvas}></canvas>
}
