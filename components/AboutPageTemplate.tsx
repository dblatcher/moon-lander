import Head from "next/head"
import { FunctionComponent, ReactChild, ReactChildren, ReactNode } from "react"
import styles from '../styles/Page.module.scss'
import VercelFooter from "./VercelFooter"

interface Props {
    title: string,
    children: ReactNode
    mainClassNames?: string[]
}

const AboutPageTemplate: FunctionComponent<Props> = ({
    title,
    children,
    mainClassNames = []
}) => {

    return (
        <div className={styles["full-height-page"]}>

            <Head>
                <title>{title}</title>
                <link legacybehavior rel="icon" href="/favicon.ico" />
            </Head>

            <main className={[styles["full-height-container"], ...mainClassNames].join(" ")}>
                {children}
            </main>
            <VercelFooter />
        </div>
    )
}

export default AboutPageTemplate