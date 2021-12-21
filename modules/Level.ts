import { World } from "physics-worlds";
import { LevelIntro } from "./LevelIntro";

type Level = [World, LevelIntro?]
interface LevelFunction { (): Promise<Level>  };

export type {
    LevelFunction, Level
}