import { World } from "physics-worlds";
import React, { useEffect } from "react";
import { KeyMap } from "../modules/types";



/**
 * Component that executes a control function on a World,
 * issuing the commands based on the controls prop
 * every time the World ticks then reports back a status object
 * with properties relevant to the parent's state.
 */
export default function WorldInterface<T extends {}>(props: {
    controls: KeyMap
    displayInput?: boolean
    singleKeyControlFunction?: { (world: World, key: string): void }
    allKeyControlFunction?: { (world: World, keyMap: KeyMap): void }
    reportWorldStatus: Function
    getWorldStatus: { (world: World): T }
    world: World
    addPoints?: { (points: number): void }
}) {

    const { 
        controls, world, 
        reportWorldStatus: report = () => { }, 
        singleKeyControlFunction, allKeyControlFunction, 
        getWorldStatus, addPoints 
    } = props;

    function executeControlFunction(tickReport: any): void {

        if (singleKeyControlFunction) {
            Object.keys(controls)
                .filter(key => controls[key] == true)
                .forEach(key => {
                    singleKeyControlFunction(world, key)
                })
        }
        if (allKeyControlFunction) {
            allKeyControlFunction(world, controls)
        }

        report(getWorldStatus(world))
    }

    function handlePoints(points: any): void {
        if (addPoints && typeof points === 'number') {
            addPoints(points)
        }
    }

    useEffect(() => {
        world.emitter.on('tick', executeControlFunction)
        world.emitter.on('add-points', handlePoints)
        return () => {
            world.emitter.off('add-points', handlePoints)
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

