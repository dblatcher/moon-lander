
import { PropsWithChildren } from "react";


interface ConfigurationProp {
    [index: string]: string
    dataBaseType: "LOCAL" | "NONE"
}

interface PropsWithChildrenAndConfig extends PropsWithChildren<{}> {
    config?: ConfigurationProp
}

interface GamePageProps extends PropsWithChildrenAndConfig {
    gameModeKey?: string
}

function getStaticConfiguration(): ConfigurationProp {

    let dataBaseType: "LOCAL" | "NONE";

    if (process.env.DATABASE_TYPE === 'LOCAL') {
        dataBaseType = 'LOCAL';
    } else {
        dataBaseType = 'NONE';
    }

    return {
        dataBaseType
    }
}



export type { ConfigurationProp, PropsWithChildrenAndConfig, GamePageProps }
export { getStaticConfiguration}