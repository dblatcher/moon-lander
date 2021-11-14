import { World } from "physics-worlds";
import { useEffect, useState } from "react";

import styles from "./styles.module.scss";


interface GetMeterValuesFunction {
    (world: World): { value: number, danger: number } | null
}

function renderNumber(value: number, dangerValue: number) {


    const threshold = dangerValue * (1 / 2);

    const redLevel = value < threshold ? 0
        : value >= dangerValue
            ? 255
            : 255 * ((value - threshold) / (dangerValue - threshold));

    const barStyle = {
        color: `rgb(${redLevel},${0},${0})`
    }

    const displayValue = value >= .5 ? value.toFixed(1) : (0).toFixed(1);

    const numberClassNames = value < dangerValue ? styles.number : [styles.number, styles.glowing].join(" ");

    return (
        <figure className={styles.frame}>
            <span className={numberClassNames} style={barStyle}>{displayValue}</span>
        </figure>
    )
}



export default function DangerMeter(props: {
    world: World
    getValues: GetMeterValuesFunction
    meterType?: "NUMBER"
}) {
    const { world, getValues, meterType } = props;
    let [value, setValue] = useState(0);
    let [dangerValue, setDangerValue] = useState(0);

    function getValueAndMaxFromWorld() {
        const valueAndMax = getValues(world);
        if (!valueAndMax) { return }
        setValue(valueAndMax.value);
        setDangerValue(valueAndMax.danger);
    }

    useEffect(() => {
        world.emitter.on('tick', getValueAndMaxFromWorld)
        return () => {
            world.emitter.off('tick', getValueAndMaxFromWorld)
        }
    })


    switch (meterType) {
        case "NUMBER":
        default:
            return renderNumber(value, dangerValue);
    }

}