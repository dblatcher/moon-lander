import { useState } from 'react'
import { Command } from '../GameContainer'
import Switch from '../Switch'
import styles from './styles.module.scss'

interface Props {
    issueCommand: { (command: Command): void }
    buttons: [Command, string, boolean?][]
}

export default function CommandMenu({ issueCommand: issue, buttons }: Props) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const buttonsToRender = buttons.filter(button => typeof button[2] === 'undefined' || button[2] === true)

    return (
        <div className={styles.container}>
            <div>
                <Switch value={isOpen} toggle={() => { setIsOpen(!isOpen) }} label='menu' />
            </div>
            {isOpen && (
                <div className={styles.menuBar}>
                    {buttonsToRender.map(button => (
                        <button key={button[0]} onClick={() => { issue(button[0]) }}>{button[1]}</button>
                    ))}
                </div>
            )}
        </div>
    )
}
