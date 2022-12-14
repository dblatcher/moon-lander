import { notes, rest } from "../../components/GameContainerTemplate/songs";
import { Song } from "../../components/GameContainerTemplate/types";

const { g4, e4f, c4 } = notes

const fail: Song = [
    {
        notes: [g4],type: 'square'
    },
    rest(.2),
    {
        notes: [e4f],type: 'square'
    },
    rest(.2),
    {
        notes: [c4],type: 'square'
    },
    rest(.2),
    {
        notes: [c4, e4f, g4],
        duration: 1.5,
        volume: .2,
        type: 'sawtooth',
    },
]

export const songs = { fail }