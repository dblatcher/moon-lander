import Head from "next/head"
import { FunctionComponent, ReactChild, ReactChildren } from "react"
import styles from '../styles/Page.module.scss'
import VercelFooter from "./VercelFooter"

interface Props {
    title: string,
    children: ReactChildren | ReactChild
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
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={[styles["full-height-container"], ...mainClassNames].join(" ")}>
                {children}
            </main>
            <VercelFooter />
        </div>
    )
}

export default AboutPageTemplate