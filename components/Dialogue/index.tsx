import React, { ReactNode } from "react";
import styles from "./styles.module.scss";



export default function Dialogue(props: Readonly<{
    children?: ReactNode
    placement?: "TOP"
    design?: "YELLOW" | "PLAIN"
}>) {

    let classNames = [styles.container]

    switch (props.placement) {
        case "TOP": classNames.push(styles.top); break;
    }
    switch (props.design) {
        case "YELLOW": classNames.push(styles.yellow); break;
        case "PLAIN": classNames.push(styles.plain); break;
    }

    return (
        <article className={classNames.join(" ")}>
            {props.children}
        </article>
    )

}