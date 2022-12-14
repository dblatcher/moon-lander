import type { Cord, Song } from "./types"

export const notes = {
    a3: 220,
    c4: 261.63,
    d4: 293.66,
    e4f: 311.13,
    e4: 329.63,
    g4: 392,
} as const;

export const rest = (duration: number): Cord => ({ duration })

export const testSongData: Song = [
    {
        notes: [notes.c4],
        type: 'sine',
    },
    rest(1),
    {
        notes: [notes.c4, notes.e4],
        type: 'sine',
    },
    {
        notes: [notes.c4, notes.e4, notes.g4],
        duration: 2,
        type: 'triangle'
    },
]

export const victorySongData: Song = [
    {
        notes: [notes.c4],
        duration: .5,
        volume: .075,
        type: 'sawtooth',
    },
    rest(.5),
    {
        notes: [notes.d4, notes.g4],
        duration: .75,
        type: 'sawtooth',
    },
    rest(.5),
    {
        notes: [notes.a3, notes.e4, notes.e4],
        duration: .5,
        type: 'sawtooth',
    },
    rest(.5),
    {
        notes: [notes.e4, notes.g4, notes.c4],
        duration: .5,
        volume: .15,
        type: 'sawtooth',
    },
]

export const failSongData: Song = [
    {
        notes: [],
        duration: 50,
        volume: 1,
    },
    {
        notes: [notes.e4f],
        duration: .75,
        volume: .075,
        type: 'sawtooth',
    },
    rest(.1),
    {
        notes: [notes.g4],
        duration: .75,
        type: 'sawtooth',
    },
    rest(.1),
    {
        notes: [notes.c4],
        duration: .5,
        type: 'sawtooth',
    },
]