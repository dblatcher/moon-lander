import { AbstractFill, CameraFollowInstruction, ViewPort, World, Body } from "physics-worlds";
import React, { useEffect, useRef } from "react";

export default function FollowBodyCanvas(props: {
    world: World
    getSubject: { (world: World): Body | null }
    magnify?: number
    width?: number
    height?: number,
    framefill?: string | AbstractFill
}) {
    const { world, magnify = 1, width = 400, height = 400, framefill, getSubject } = props
    const canvas = useRef<HTMLCanvasElement | null>(null)
    const viewPort = useRef<ViewPort | null>(null)
    const effectiveWidth = Math.min(width, world.width * magnify);

    useEffect(() => {
        if (canvas.current && !viewPort.current) {
            const subject = getSubject(world);
            if (!subject) {
                viewPort.current = ViewPort.full(world, canvas.current, magnify)
                return
            }

            viewPort.current = new ViewPort({
                world, canvas: canvas.current,
                width: effectiveWidth, height,
                x: subject.data.x, y: subject.data.y,
                magnify,
                framefill,
            })
            viewPort.current.cameraInstruction = new CameraFollowInstruction({
                body: subject, followHeading: false, magnify, leadDistance: 0, staywithinWorldEdge: true
            })
            viewPort.current.renderCanvas()
        }
    }, [world])

    return <canvas ref={canvas}></canvas>
}
