import { SoundDeck } from "physics-worlds";


function makeSoundDeck() {

    const deck = new SoundDeck()

    deck.defineSampleBuffer('die', "/audio/die.mp3");
    deck.defineSampleBuffer('bang', "/audio/bang.mp3");
    deck.defineSampleBuffer('beep', "/audio/beep.mp3");

    deck.enable()
    return deck
}

export { makeSoundDeck }