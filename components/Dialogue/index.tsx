import React, { ReactNode } from "react";
import styles from "./styles.module.scss";



export default function Dialogue(props: Readonly<{
    children?: ReactNode
    placement?: "TOP"
    design?: "YELLOW" | "PLAIN" | "METAL"
}>) {
    const {design, placement} = props;
    let classNames = [styles.container]

    switch (placement) {
        case "TOP": classNames.push(styles.top); break;
    }
    switch (design) {
        case "YELLOW": classNames.push(styles.yellow); break;
        case "PLAIN": classNames.push(styles.plain); break;
        case "METAL": classNames.push(styles.metal); break;
    }

    return (
        <article className={classNames.join(" ")}>
            {props.children}
            {design === "METAL" && <span className={styles["bottom-rivets"]}></span>}
        </article>
    )

}