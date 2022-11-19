import React from "react";
import { KeyMap } from "../modules/types";


/**
 * Component that reports which keyboard keys are down,
 * optionally converting the key names to aliased
 * string relevant to the parent App.
 */
export default class KeyReader extends React.Component {
    props!: {
        controlMapping?: { [index: string]: string }
        displayInput?: boolean
        report?: Function
        issueCommand?: Function
    }
    state!: {
        keyMap: KeyMap
    }

    constructor(props: KeyReader["props"]) {
        super(props)
        this.state = {
            keyMap: {},
        }
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.reportKeyPress = this.reportKeyPress.bind(this);
    }

    get mappedKeys(): KeyMap {
        const { controlMapping } = this.props;
        const { keyMap } = this.state;
        if (!controlMapping) { return keyMap }
        const output: KeyMap = {}

        Object.keys(keyMap)
            .filter(key => keyMap[key] == true)
            .forEach(key => {
                if (controlMapping[key]) {
                    output[controlMapping[key]] = true
                }
            })

        return output
    }

    handleKeyEvent(keyState: boolean, key: string) {
        const { report = () => { } } = this.props;

        if (!!this.state.keyMap[key] == !!keyState) { return }

        this.setState((state: KeyReader["state"]) => {
            state.keyMap[key] = keyState
            return { keyMap: state.keyMap }
        }, () => {
            report(this.mappedKeys)
        })
    }

    handleKeyDown(event: KeyboardEvent) { this.handleKeyEvent(true, event.key) }
    handleKeyUp(event: KeyboardEvent) { this.handleKeyEvent(false, event.key) }

    reportKeyPress(event: KeyboardEvent) {
        const { controlMapping, issueCommand } = this.props;
        if (!issueCommand) { return }

        if (controlMapping) {
            if (controlMapping[event.key]) {
                issueCommand(controlMapping[event.key])
            }
        } else {
            issueCommand(event.key)
        }
    }

    componentDidMount() {
        document.body.addEventListener('keydown', this.handleKeyDown)
        document.body.addEventListener('keyup', this.handleKeyUp)
        document.body.addEventListener('keypress', this.reportKeyPress)
    }

    componentWillUnmount() {
        document.body.removeEventListener('keydown', this.handleKeyDown)
        document.body.removeEventListener('keyup', this.handleKeyUp)
        document.body.removeEventListener('keypress', this.reportKeyPress)
    }

    render() {
        if (!this.props.displayInput) { return null }
        const { keyMap } = this.state;
        let display = ":"

        Object.keys(keyMap)
            .filter(key => keyMap[key] == true)
            .forEach(key => display += " " + key)

        return (
            <aside>
                <span>keys:</span>
                <span>{display}</span>
            </aside>
        )
    }
}


