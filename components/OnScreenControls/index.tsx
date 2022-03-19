import { MouseEventHandler, useState } from "react";
import { OnScreenTapButton } from "./OnScreenTapButton";
import { OnScreenTouchButton } from "./OnScreenTouchButton";
import styles from "./styles.module.scss";


type Direction = 'up' | 'down' | 'left' | 'right'

export default function OnScreenControls(props: {
    displayInput?: boolean
    report?: Function
    reportPress?: Function
    directionButtons?: Direction[]
    commandButtons?: string[]
}) {

    const { report = () => { }, reportPress, directionButtons = [], commandButtons = [] } = props

    const [keys, setKeys] = useState<{ [index: string]: boolean }>({})

    function respondToDirection(onOrOff: boolean, action: string) {
        const newKeys = Object.assign(keys, {})
        newKeys[action] = onOrOff;
        setKeys(newKeys)
        report(newKeys)
    }

    function respondToCommand(command: string) {
        if (reportPress) {
            reportPress(command)
        }
    }

    const doNothing: MouseEventHandler = (event) => {
        event.preventDefault()
    }

    return <aside className={styles.panel} onContextMenu={doNothing}>

        <div className={styles.directionsFrame}>
            {directionButtons.map(
                direction => <OnScreenTouchButton key={direction}
                    action={direction}
                    isOn={keys[direction]}
                    respond={respondToDirection} />
            )}
        </div>

        <div className={styles.commandsFrame}>
            {commandButtons.map(
                command => <OnScreenTapButton key={command}
                    action={command}
                    reportPress={respondToCommand} />
            )}
        </div>

        <span className={styles["bottom-rivets"]}></span>
    </aside>
}