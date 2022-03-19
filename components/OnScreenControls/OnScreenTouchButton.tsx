import styles from "./styles.module.scss";

export function OnScreenTouchButton(props: {
    respond: { (onOrOff: boolean, action: string): void }
    action: string
    isOn: boolean
}) {
    const { respond, action, isOn } = props
    return <div className={[styles.button, styles[action]].join(" ")}
        style={{ background: isOn ? 'blue' : 'red' }}
        onMouseDown={() => { respond(true, action) }}
        onMouseLeave={() => { respond(false, action) }}
        onMouseUp={() => { respond(false, action) }}
        onTouchStart={() => { respond(true, action) }}
        onTouchCancel={() => { respond(false, action) }}
        onTouchEnd={() => { respond(false, action) }}
        key={action}>{action}
    </div>
}
