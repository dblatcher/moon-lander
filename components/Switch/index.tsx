import styles from './styles.module.scss'

interface Props {
    toggle: { (): void }
    value: boolean
    label?: string
    buttonText?: [string, string]
}

export default function Switch({ toggle, value, label }: Props) {

    const buttonClasses = [styles.slider]
    if (value) { buttonClasses.push(styles.on) }


    return (
        <div className={styles.container}>
            {label && <span className={styles.label}>{label}</span>}
            <button className={buttonClasses.join(' ')} onClick={toggle}>
                <span></span>
            </button>
        </div>
    )
}
