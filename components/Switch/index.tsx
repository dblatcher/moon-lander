import { CSSProperties } from 'react'
import styles from './styles.module.scss'

interface Props {
    toggle: { (): void }
    value: boolean
    label?: string
    buttonText?: [string, string]
    style?: CSSProperties
}

export default function Switch({ toggle, value, label, style = {} }: Props) {

    const buttonClasses = [styles.slider]
    if (value) { buttonClasses.push(styles.on) }


    return (
        <div style={style} className={styles.container}>
            {label && <span className={styles.label}>{label}</span>}
            <button className={buttonClasses.join(' ')} onClick={toggle}>
                <span></span>
            </button>
        </div>
    )
}
