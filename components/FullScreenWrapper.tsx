import { CSSProperties, ReactChild, ReactChildren, useEffect, useRef, useState } from "react"

import styles from '../styles/Page.module.scss'

const buttonStyle:CSSProperties = {
    position:'absolute',
    top:0,
    right:0,
    margin:'.5rem',
}

export default function FullScreenWrapper(props: {
    children: ReactChildren | ReactChild
}) {
    const wrapper = useRef<HTMLDivElement>(null);
    const [isFullScreen, setIsFullScreen] = useState(false)

    function requestFullScreen() {
        wrapper.current?.requestFullscreen()
    }

    function handleFullScreenChange(event:Event) {
        setIsFullScreen(document.fullscreenElement === wrapper.current)
    }

    useEffect( () => {
        const {current:element} = wrapper;
        if (!element) {return}

        element.addEventListener('fullscreenchange', handleFullScreenChange)
        return () => {
            element.removeEventListener('fullscreenchange', handleFullScreenChange)
        }
    })

    return <div ref={wrapper} className={styles["full-height-container"]}>
        {props.children}
        {!isFullScreen && (
            <button 
            style = {buttonStyle}
            onClick={requestFullScreen}>full screen</button>
        )}
    </div>
}