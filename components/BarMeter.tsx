import { World } from "physics-worlds";
import { useEffect, useState } from "react";

import styles from "./BarMeter.module.scss";


interface GetMeterValuesFunction {
    (world: World): { value: number, max: number } | null
}

function renderBar(value: number, maxValue: number) {
    const barStyle = {
        transform: `scaleY(${(value / maxValue) * 100}%)`
    }
    return (
        <figure className={styles.meter}>
            <div className={styles.bar} style={barStyle}></div>
        </figure>
    )
}

function renderGage(value: number, maxValue: number) {

    const needleStyle = {
        transform: `translateX(-50%) rotate(${(180 * value / maxValue) -90}deg)`
    }
    return (
        <figure className={styles.gage}>
            <div className={styles.panel}></div>
            <div className={styles.needle} style={needleStyle}></div>
        </figure>
    )
}

export default function BarMeter(props: {
    world: World
    getValues: GetMeterValuesFunction
    meterType?: "BAR" | "GAGE"
}) {
    const { world, getValues, meterType } = props;
    let [value, setValue] = useState(0);
    let [maxValue, setMaxValue] = useState(0);

    function getValueAndMaxFromWorld() {
        const valueAndMax = getValues(world);
        if (!valueAndMax) { return }
        setValue(valueAndMax.value);
        setMaxValue(valueAndMax.max);
    }

    useEffect(() => {
        world.emitter.on('tick', getValueAndMaxFromWorld)
        return () => {
            world.emitter.off('tick', getValueAndMaxFromWorld)
        }
    })


    switch (meterType) {
        case "GAGE":
            return renderGage(value, maxValue);
        case "BAR":
        default:
            return renderBar(value, maxValue);
    }

}