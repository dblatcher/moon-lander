import { World, Body } from "physics-worlds";
import { useEffect, useState } from "react";
import { SpaceShip } from "../modules/SpaceShip";
import styles from "./ThrustMeter.module.scss";

export default function ThrustMeter(props: {
    world: World
}) {
    const { world } = props;
    let [thrust, setThrust] = useState(0);
    let [maxThrust, setMaxThrust] = useState(0);

    function getThrustValueFromWorld() {
        const playerBody: Body | undefined = world.bodies.find(body => body.typeId == "SpaceShip")
        if (!playerBody) { return }
        const player = playerBody as SpaceShip;
        setThrust(player.data.thrust || 0);
        setMaxThrust(player.data.maxThrust || 0);
    }

    useEffect(() => {
        world.emitter.on('tick', getThrustValueFromWorld)
        return () => {
            world.emitter.off('tick', getThrustValueFromWorld)
        }
    })

    const barStyle = {
        transform: `scaleY(${(thrust/maxThrust)*100}%)`
    }

    return ( 
        <figure className={styles.meter}>
            <div className={styles.bar} style={barStyle}></div>
        </figure>
    )
}