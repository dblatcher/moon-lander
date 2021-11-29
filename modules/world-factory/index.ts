import { World } from "physics-worlds";
import { makeBlueMoonLevel } from "./blueMoonLevel";
import { makeCavernLevel } from "./cavernLevel";
import { makeCityLevel } from "./cityLevel";
import { makeDaylightCityLevel } from "./dayLightCityLevel";
import { makeMountainsLevel } from "./mountainLevel";


interface LevelFunction { (): World };

export type { LevelFunction }
export {
    makeDaylightCityLevel,
    makeMountainsLevel,
    makeCityLevel,
    makeBlueMoonLevel,
    makeCavernLevel,
}