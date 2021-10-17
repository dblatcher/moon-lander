import React from "react"
import { Command } from "../modules/worldFactory"

interface InputFunction {
    (key: Command): void
}

interface ControlsProps {
    handleInput: InputFunction
}

export type { ControlsProps }

export default class Controls extends React.Component {
    props!: ControlsProps

    render() {
        const { handleInput } = this.props
        return (
            <div>
                <button onClick={() => handleInput('up')}>up</button>
                <button onClick={() => handleInput('left')} >left</button>
            </div>
        )
    }
}