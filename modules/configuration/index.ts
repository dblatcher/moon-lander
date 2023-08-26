
import { PropsWithChildren } from "react";
import { GameDefinition } from "../types";


interface ConfigurationProp {
    [index: string]: string
    dataBaseType: "NONE" | "POSTGRES" | "LOCAL"
}

interface PropsWithChildrenAndConfig extends PropsWithChildren<{}> {
    config?: ConfigurationProp
}

interface GamePageProps extends PropsWithChildrenAndConfig {
    gameModeKey?: string
}

export function getStaticConfiguration(): ConfigurationProp {

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
            config: getStaticConfiguration(),
            gameModeKey: context.params.mode,
        },
    }
}


export type { ConfigurationProp, PropsWithChildrenAndConfig, GamePageProps }