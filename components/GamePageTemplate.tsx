import Head from "next/head"
import Link from "next/link"
import { FunctionComponent, ReactChild, ReactChildren } from "react"
import FullScreenWrapper from "./FullScreenWrapper"
import styles from '../styles/Page.module.scss'



const GamePageTemplate: FunctionComponent<{ title: string, children: ReactChildren | ReactChild }> = ({
    title,
    children
}) => {

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>{title}</title>
            </Head>

            <main className={styles["full-height-container"]}>

                <Link href="/" passHref={true}><a>&lArr; homepage</a></Link>

                <FullScreenWrapper>
                    {children}
                </FullScreenWrapper>
            </main>
        </div>
    )
}

export default GamePageTemplate