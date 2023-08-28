import { PropsWithChildren } from "react";
import { GameDefinition } from "../types";

export interface ConfigurationProp {
    dataBaseType: "NONE" | "POSTGRES" | "LOCAL"
}


export interface GamePageProps extends PropsWithChildren<{}> {
    config?: ConfigurationProp
    gameModeKey?: string
}

/** Get the configuartion values from the environment which are **SAFE TO BE EXPOSED CLIENT SIDE**. */
export function getSharedConfig(): ConfigurationProp {

    let dataBaseType: ConfigurationProp['dataBaseType'];

    switch (process.env.DATABASE_TYPE) {
        case 'POSTGRES':
        case 'LOCAL':
            dataBaseType = process.env.DATABASE_TYPE;
            break;
        default:
            dataBaseType = 'NONE'
            break;
    }

    return {
        dataBaseType
    }
}


export const getGamePageStaticPaths = (gameDefinition: GameDefinition) => {
    return {
        paths: Object.keys(gameDefinition.gameModes).map(key => `/${gameDefinition.route}/${key}`),
        fallback: false
    }
}


export const buildGameGetStaticProps = () => async (context: { params: { mode: string } }): Promise<{ props: GamePageProps }> => {
    return {
        props: {
            config: getSharedConfig(),
            gameModeKey: context.params.mode,
        },
    }
}
