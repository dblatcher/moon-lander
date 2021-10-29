import { World } from "physics-worlds";
import React, { useEffect } from "react";


interface ControlFunction {
    (world: World, key: string): void
}

interface WorldStatusFunction {
    (world: World): any
}

/**
 * Component that executes a control function on a World,
 * issuing the commands based on the controls prop
 * every time the World ticks then reports back a status object
 * with properties relevant to the parent's state.
 */
export default function WorldInterface(props: {
    controls: { [index: string]: boolean }
    displayInput?: boolean
    controlFunction: ControlFunction
    reportWorldStatus: Function
    getWorldStatus: WorldStatusFunction
    world: World
}) {

    const { controls, world, controlFunction, reportWorldStatus: report = () => { }, getWorldStatus } = props;

    function executeControlFunction(tickReport: any): void {
        Object.keys(controls)
            .filter(key => controls[key] == true)
            .forEach(key => {
                controlFunction(world, key)
            })

        report(getWorldStatus(world))
    }

    useEffect(() => {
        world.emitter.on('tick', executeControlFunction)
        return () => {
            world.emitter.off('tick', executeControlFunction)
        }
    })

    if (!props.displayInput) { return null }

    let controlsDisplay = "controls:"
    Object.keys(controls)
        .filter(key => controls[key] == true)
        .forEach(key => controlsDisplay += " " + key)
    return (<p>{controlsDisplay}</p>)
}

