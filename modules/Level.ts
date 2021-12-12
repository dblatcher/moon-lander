import { World } from "physics-worlds";
import { LevelIntro } from "./LevelIntro";

type Level = [World, LevelIntro?]
interface LevelFunction { (): Level  };

export type {
    LevelFunction, Level
}