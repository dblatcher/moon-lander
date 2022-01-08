import { AbstractFill, CameraFollowInstruction, ViewPort, World } from "physics-worlds";
import React, { useEffect, useRef } from "react";
import { getPlayerSpaceship } from "../modules/worldValues";

export default function FollowBodyCanvas(props: {
    world: World
    magnify?: number
    width?: number
    height?: number,
    framefill?: string | AbstractFill
}) {
    const { world, magnify = 1, width = 400, height = 400, framefill } = props
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const viewPort = useRef<ViewPort | null>(null)
    const effectiveWidth = Math.min(width, world.width * magnify);

    useEffect(() => {
        if (canvas.current && !viewPort.current) {
            const player = getPlayerSpaceship(world);
            if (!player) {
                viewPort.current = ViewPort.full(world, canvas.current, magnify)
                return
            }

            viewPort.current = new ViewPort({
                world, canvas: canvas.current,
                width: effectiveWidth, height,
                x: player.data.x, y: player.data.y,
                magnify,
                framefill,
            })
            viewPort.current.cameraInstruction = new CameraFollowInstruction({
                body: player, followHeading: false, magnify, leadDistance: 0, staywithinWorldEdge: true
            })
            viewPort.current.renderCanvas()
        }
    }, [world])

    return <canvas ref={canvas}></canvas>
}
