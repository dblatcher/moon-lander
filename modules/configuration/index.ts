
import { PropsWithChildren } from "react";
import { GameMode } from "../GameMode";


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

export type GamePageModel = {
    title: string
    modes: Record<string, GameMode>,
    route: string,
    scoreFetcherUrl: string,
}

export const getGamePageStaticPaths = (model: GamePageModel) => {
    return {
        paths: Object.keys(model.modes).map(key => `/${model.route}/${key}`),
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