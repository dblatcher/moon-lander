import { CSSProperties } from 'react'
import styles from './styles.module.scss'

interface Props {
    toggle: { (): void }
    value: boolean
    buttonText?: [string, string]
    style?: CSSProperties
}

export default function BurgerSwitch({ toggle, value, style = {} }: Props) {
    const buttonClasses = [styles.burger]
    if (value) { buttonClasses.push(styles.on) }

    return (
        <button style={style} className={buttonClasses.join(' ')} onClick={toggle}>
            <div></div>
            <div></div>
            <div></div>
        </button>
    )
}
