import { MouseEventHandler, useState } from "react";
import { allCommands, Command } from '../../components/GameContainerTemplate/index'
import { OnScreenTapButton } from "./OnScreenTapButton";
import { OnScreenTouchButton } from "./OnScreenTouchButton";
import styles from "./styles.module.scss";


function getTouchButtons(controlMapping: {
    [index: string]: string;
}) {

    const directions: string[] = []
    const actions: string[] = []
    const commands: Command[] = ['PAUSE', 'START']
    const buttonsRequired = Object.values(controlMapping);

    buttonsRequired.forEach(buttonValue => {
        if ((allCommands as Readonly<string[]>).includes(buttonValue)) { return }
        if ((directions as string[]).includes(buttonValue)) { return }
        if (actions.includes(buttonValue)) { return }

        switch (buttonValue) {
            case 'up':
            case 'down':
            case 'left':
            case 'right':
                directions.push(buttonValue)
                return
            default:
                actions.push(buttonValue)
                return
        }

    })

    return {
        directions, actions, commands
    }

}


export default function OnScreenControls(props: {
    displayInput?: boolean
    report?: Function
    issueCommand: { (command: Command): void }
    controlMapping: {[index: string]: string};
}) {

    const { report = () => { }, issueCommand,  controlMapping } = props

    const {directions,actions,commands} = getTouchButtons(controlMapping)

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
            {directions.map(
                direction => <OnScreenTouchButton key={direction}
                    action={direction}
                    isOn={keys[direction]}
                    respond={respondToDirection} />
            )}
        </div>

        <div className={styles.commandsFrame}>
            {commands.map(
                command => <OnScreenTapButton key={command}
                    action={command}
                    issueCommand={issueCommand} />
            )}
        </div>

        <div className={styles.commandsFrame}>
            {actions.map(
                action => <OnScreenTouchButton key={action}
                    action={action}
                    isOn={keys[action]}
                    respond={respondToDirection} />
            )}
        </div>

        <span className={styles["bottom-rivets"]}></span>
    </aside>
}