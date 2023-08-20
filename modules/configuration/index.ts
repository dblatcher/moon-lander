
import { PropsWithChildren } from "react";
import { GameMode } from "../GameMode";
import { GameDefinition } from "../types";


interface ConfigurationProp {
    [index: string]: string
    dataBaseType: "LOCAL" | "NONE" | "POSTGRES"
}

interface PropsWithChildrenAndConfig extends PropsWithChildren<{}> {
    config?: ConfigurationProp
}

interface GamePageProps extends PropsWithChildrenAndConfig {
    gameModeKey?: string
}

function getStaticConfiguration(): ConfigurationProp {

    let dataBaseType: ConfigurationProp['dataBaseType'];

    switch (process.env.DATABASE_TYPE)  {
        case 'LOCAL':
        case 'POSTGRES':
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
export { getStaticConfiguration, }