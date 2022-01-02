import { SoundControl, World } from "physics-worlds";
import { useEffect, useRef, useState } from "react";

import styles from "./styles.module.scss";


interface GetMeterValuesFunction {
    (world: World): { value: number, danger: number } | null
}

function renderNumber(value: number, dangerValue: number, caption?: string) {


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
        <figure className={styles.figure}>
            <div className={styles.frame}>
                <span className={numberClassNames} style={barStyle}>{displayValue}</span>
            </div>
            {caption && <figcaption>{caption}</figcaption>}
        </figure>
    )
}


export default function DangerMeter(props: {
    world: World
    getValues: GetMeterValuesFunction
    meterType?: "NUMBER"
    caption?: string
    sampleName?: string
}) {
    const { world, getValues, meterType, caption, sampleName } = props;
    let [value, setValue] = useState(0);
    let [dangerValue, setDangerValue] = useState(0);
    const sound = useRef<SoundControl | null>(null);

    if (!sound.current && world.soundDeck && sampleName) {
        sound.current = world.soundDeck.playSample(sampleName, { volume: 0, loop: true })
    }

    function getValueAndMaxFromWorld() {
        const valueAndMax = getValues(world);
        if (!valueAndMax) {
            if (sound.current) {
                sound.current.volume = 0
            }
            return
        }
        setValue(valueAndMax.value);
        setDangerValue(valueAndMax.danger);

        if (sound.current) {
            sound.current.volume = (dangerValue > 0 && value >= dangerValue) ? .2 : 0
        }
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
            return renderNumber(value, dangerValue, caption);
    }

}