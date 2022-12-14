import { SoundDeck } from "physics-worlds";
import type { Cord, Song } from "./types";

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function makeSoundDeck(effects: { [index: string]: string }) {
    const deck = new SoundDeck()
    Object.entries(effects).forEach(([name, src]) => {
        deck.defineSampleBuffer(name, src)
    })
    deck.enable()
    return deck
}


async function playCordData(deck: SoundDeck, cord: Cord): Promise<void> {
    const { notes = [], duration = 1, type = 'sine', volume = .1 } = cord;
    if (notes.length === 0 || !deck) {
        return await sleep(duration)
    }

    const sounds = notes.map(frequency => {
        return deck.playTone({ frequency, duration, type }, { volume: volume / notes.length })
    })

    return sounds[0]?.whenEnded.then(() => { return })
}

async function playSongData(song: Song, deck?: SoundDeck,): Promise<boolean> {
    if (!deck) { return false }
    for (let i = 0; i < song.length; i++) {
        await playCordData(deck, song[i])
    }
    return true
}


export { makeSoundDeck, playSongData }