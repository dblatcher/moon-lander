import { ImageFill } from "physics-worlds";

import soilImage from "../../image/soil.jpg";
import jupiterImage from "../../image/jupiter.jpg";
import neptuneImage from "../../image/neptune.jpg";


const data: { [index: string]: [string, string, any] } = {
    soil: [soilImage.src, 'brown', { scale: 1, rotate: 30 }],
    jupiter: [jupiterImage.src, 'orange', { scale: 10 }],
    neptune: [neptuneImage.src, 'blue', { scale: 3 }],
}

// needs to be in a function so Next.js doesn't create the Image fills server-side when importing the module

function createImageFill(key: string): ImageFill {
    if (data[key]) {
        return ImageFill.fromSrc(...data[key])
    }
    return ImageFill.fromSrc(...data['soil']);
}

export {
    createImageFill
}