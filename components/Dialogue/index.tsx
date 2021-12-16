import React, {  ReactNode } from "react";
import styles from "./styles.module.scss";



export default function Dialogue(props:Readonly<{
    children?: ReactNode
}>) {


    return (
        <article className={styles.container}>
            {props.children}
        </article>
    )

}