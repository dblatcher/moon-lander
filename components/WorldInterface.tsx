import { World } from "physics-worlds";
import React, { useEffect } from "react";
import { getPlayerSpaceship, getWorldStatus } from "../modules/worldValues";


interface ControlFunction {
    (world: World, key: string): void
}


/**
 * Component that executes a control function on a World,
 * issuing the commands based on the state of the controls
 * every time the World ticks and reports back events in the
 * world that are relevant to the GameContainer state.
 */
export default function WorldInterface(props: {
    controls: { [index: string]: boolean }
    displayInput?: boolean
    controlFunction: ControlFunction
    reportWorldStatus: Function
    world: World
}) {

    const { controls, world, controlFunction, reportWorldStatus: report = () => { } } = props;

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

