interface ConfigurationProp {
    dataBaseType: "LOCAL" | "NONE"
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

export type { ConfigurationProp }
export { getStaticConfiguration }