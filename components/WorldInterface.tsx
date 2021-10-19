import { World } from "physics-worlds";
import React, { useEffect } from "react";


interface ControlFunction {
    (world: World, key: string): void
}

/**
 * Component that executes a control function on a World,
 * issuing the commands based on the state of the controls
 * every time the World ticks.
 */
export default function WorldInterface(props: {
    controls: { [index: string]: boolean }
    displayInput?: boolean
    controlFunction: ControlFunction
    world: World
}) {

    const { controls, world, controlFunction } = props;

    function executeControlFunction(tickReport: any): void {
        Object.keys(controls)
            .filter(key => controls[key] == true)
            .forEach(key => {
                controlFunction(world, key)
            })
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

