import { SoundDeck } from "physics-worlds";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function makeSoundDeck() {

    const deck = new SoundDeck()

    deck.defineSampleBuffer('die', "/audio/die.mp3");
    deck.defineSampleBuffer('bang', "/audio/bang.mp3");
    deck.defineSampleBuffer('beep', "/audio/beep.mp3");

    deck.enable()
    return deck
}

const notes = {
    a3: 220,
    c4: 261.63,
    d4: 293.66,
    e4f: 311.13,
    e4: 329.63,
    g4: 392,
}

async function playCord(deck: SoundDeck, notes: number | number[], duration: number, volume: number) {

    let harmony: number[] = (typeof notes === 'number') ? [notes] : notes;

    const sounds = harmony.map(frequency => {
        return deck.playTone({ frequency, duration, type: 'sawtooth' }, { volume: volume / harmony.length })
    })

    return sounds[0]?.whenEnded
}

async function playVictorySong(deck?: SoundDeck) {

    if (!deck) { return false }
    await playCord(deck, notes.c4, .5, .075)
    await sleep(10);
    await playCord(deck, [notes.d4, notes.g4], .75, .1)
    await sleep(10);
    await playCord(deck, [notes.a3, notes.e4, notes.e4], .5, .1)
    await sleep(10);
    await playCord(deck, [notes.e4, notes.g4, notes.c4], .5, .15)
    return true
}

async function playFailSong(deck?: SoundDeck) {

    if (!deck) { return false }
    await sleep(500);
    await playCord(deck, notes.e4f, .75, .075)
    await sleep(10);
    await playCord(deck, [notes.g4], .75, .1)
    await sleep(10);
    await playCord(deck, [notes.c4], .5, .1)
    return true
}

export { makeSoundDeck, playVictorySong, playFailSong }