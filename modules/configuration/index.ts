
import { PropsWithChildren } from "react";


interface ConfigurationProp {
    [index: string]: string
    dataBaseType: "LOCAL" | "NONE"
}

interface PropsWithChildrenAndConfig extends PropsWithChildren<{}> {
    config?: ConfigurationProp
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



export type { ConfigurationProp, PropsWithChildrenAndConfig }
export { getStaticConfiguration}