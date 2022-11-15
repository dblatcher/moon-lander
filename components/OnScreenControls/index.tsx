import { MouseEventHandler, useState } from "react";
import { Command } from '../moon-lander/GameContainer'
import { OnScreenTapButton } from "./OnScreenTapButton";
import { OnScreenTouchButton } from "./OnScreenTouchButton";
import styles from "./styles.module.scss";


type Direction = 'up' | 'down' | 'left' | 'right'

export default function OnScreenControls(props: {
    displayInput?: boolean
    report?: Function
    issueCommand: { (command: Command): void }
    directionButtons?: Direction[]
    commandButtons?: Command[]
}) {

    const { report = () => { }, issueCommand, directionButtons = [], commandButtons = [] } = props

    const [keys, setKeys] = useState<{ [index: string]: boolean }>({})

    function respondToDirection(onOrOff: boolean, action: string) {
        const newKeys = Object.assign(keys, {})
        newKeys[action] = onOrOff;
        setKeys(newKeys)
        report(newKeys)
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
                    issueCommand={issueCommand} />
            )}
        </div>

        <span className={styles["bottom-rivets"]}></span>
    </aside>
}