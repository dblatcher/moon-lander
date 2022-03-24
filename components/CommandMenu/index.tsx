import { useState } from 'react'
import { GameMode } from '../../modules/GameMode'
import BurgerSwitch from '../BurgerSwitch'
import { Command } from '../GameContainer'
import Switch from '../Switch'
import styles from './styles.module.scss'

interface Props {
    issueCommand: { (command: Command): void }
    isPaused: boolean
    showOnScreenControls: boolean
    soundEnabled: boolean
    gameMode: GameMode
}

const switchStyle = { justifyContent: 'flex-end', margin: '.5em 0' }

export default function CommandMenu({ issueCommand, showOnScreenControls, soundEnabled, gameMode, isPaused }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const commandFunc = (command: Command) => () => { if (isOpen) { issueCommand(command) } }
    const { allowRestart, allowSkip } = gameMode


    return (
        <div className={styles.container}>
            <div>
                <BurgerSwitch value={isOpen} toggle={() => { setIsOpen(!isOpen) }} />
            </div>
            {isOpen && (
                <div className={styles.menuBar}>
                    <Switch style={switchStyle} value={isPaused} toggle={commandFunc('PAUSE')} label='pause' />
                    {allowRestart && <button className={styles.button} onClick={commandFunc('RESTARTLEVEL')}>Restart Level</button>}
                    {allowSkip && <button className={styles.button} onClick={commandFunc('SKIPLEVEL')}>Skip Level</button>}
                    <Switch style={switchStyle} value={soundEnabled} toggle={commandFunc('SOUNDTOGGLE')} label='sound' />
                    <Switch style={switchStyle} value={showOnScreenControls} toggle={commandFunc('CONTROLTOGGLE')} label='touch controls' />
                    <br></br>
                    <button className={styles.button} onClick={commandFunc('QUIT')}>Quit</button>
                </div>
            )}
        </div>
    )
}
