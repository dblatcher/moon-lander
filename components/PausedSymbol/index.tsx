import { ReactNode } from "react";
import Dialogue from "../Dialogue";
import styles from "./styles.module.scss";

export default function PausedSymbol(props: Readonly<{
    children?: ReactNode
}>) {

    return (
        <Dialogue>
            <div className={styles.container}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </div>
        </Dialogue>
    )
}