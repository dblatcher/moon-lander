import { World } from "physics-worlds";
import { useEffect, useState } from "react";
import { GetMeterValuesFunction } from "../modules/worldValues";
import styles from "./BarMeter.module.scss";




export default function BarMeter(props: {
    world: World
    getValues: GetMeterValuesFunction
}) {
    const { world, getValues } = props;
    let [value, setValue] = useState(0);
    let [maxValue, setMaxValue] = useState(0);

    function getValueAndMaxFromWorld() {
        const valueAndMax = getValues(world);
        if (!valueAndMax) { return }
        setValue(valueAndMax.value || 0);
        setMaxValue(valueAndMax.max || 0);
    }

    useEffect(() => {
        world.emitter.on('tick', getValueAndMaxFromWorld)
        return () => {
            world.emitter.off('tick', getValueAndMaxFromWorld)
        }
    })

    const barStyle = {
        transform: `scaleY(${(value / maxValue) * 100}%)`
    }

    return (
        <figure className={styles.meter}>
            <div className={styles.bar} style={barStyle}></div>
        </figure>
    )
}