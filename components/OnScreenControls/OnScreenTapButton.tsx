import styles from "./styles.module.scss";

export function OnScreenTapButton(props: {
    action: string
    reportPress: Function
}) {
    const { action, reportPress } = props
    return <button className={[styles.button, styles[action]].join(" ")}
        onClick={() => { reportPress(action) }}
        key={action}>{action}
    </button>
}