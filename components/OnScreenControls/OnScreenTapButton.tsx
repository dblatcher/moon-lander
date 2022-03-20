import styles from "./styles.module.scss";

export function OnScreenTapButton(props: {
    action: string
    issueCommand: Function
}) {
    const { action, issueCommand } = props
    return <button className={[styles.button, styles[action]].join(" ")}
        onClick={() => { issueCommand(action) }}
        key={action}>{action}
    </button>
}