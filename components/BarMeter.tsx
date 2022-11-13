import { World } from "physics-worlds";
import { useEffect, useState } from "react";

import styles from "./BarMeter.module.scss";


interface GetMeterValuesFunction {
    (world: World): { value: number, max: number } | null
}

function renderBar(value: number, maxValue: number, caption?: string) {
    const barStyle = {
        transform: `scaleY(${(value / maxValue) * 100}%)`
    }
    return (
        <figure className={styles.meter}>
            <div className={styles.wrapper}>
                <div className={styles.bar} style={barStyle}></div>
            </div>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}

function renderGage(value: number, maxValue: number, caption?: string) {

    const needleStyle = {
        transform: `translateX(-50%) rotate(${(180 * value / maxValue) - 90}deg)`
    }
    return (
        <figure className={styles.gage}>
            <div className={styles.wrapper}>
                <div className={styles.panel}></div>
                <div className={styles.needle} style={needleStyle}></div>
                <div className={styles.center}></div>
                <span className={styles.labelEmpty}>0%</span>
                <span className={styles.labelFull}>100%</span>
            </div>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}

function renderBiGage(value: number, maxValue: number, caption?: string) {

    const angle = 90 * (value / maxValue)

    const needleStyle = {
        transform: `translateX(-50%) rotate(${angle}deg)`
    }
    return (
        <figure className={styles.gage}>
            <div className={styles.wrapper}>
                <div className={styles.panel}></div>
                <div className={styles.needle} style={needleStyle}></div>
                <div className={styles.center}></div>
                <span className={styles.labelEmpty}>-100%</span>
                <span className={styles.labelFull}>100%</span>
            </div>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}

export default function BarMeter(props: {
    world: World
    getValues: GetMeterValuesFunction
    meterType?: "BAR" | "GAGE" | "BIGAGE"
    caption?: string
}) {
    const { world, getValues, meterType, caption } = props;
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
            return renderGage(value, maxValue, caption);
        case "BIGAGE":
            return renderBiGage(value, maxValue, caption);
        case "BAR":
        default:
            return renderBar(value, maxValue, caption);
    }

}