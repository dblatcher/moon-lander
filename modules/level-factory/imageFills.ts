import { ImageFill, Geometry } from "physics-worlds";

import soilImage from "../../image/soil.jpg";
import jupiterImage from "../../image/jupiter.jpg";
import neptuneImage from "../../image/neptune.jpg";
import brickImage from "../../image/brick.png";
import skyImage from "../../image/clouds.png";


interface ImageFillTransforms {
    scale?: number
    rotate?: number
    parallax?: number
    offset?: Geometry.Vector
}

const data: { [index: string]: [string, string, ImageFillTransforms] } = {
    soil: [soilImage.src, 'brown', { scale: 1, rotate: 30 }],
    jupiter: [jupiterImage.src, 'orange', { scale: 10 }],
    jupiter5: [jupiterImage.src, 'orange', { scale: 3.5, parallax: 5 }],
    neptune: [neptuneImage.src, 'blue', { scale: 3 }],
    brick: [brickImage.src, 'red', { scale: .5 }],
    sky: [skyImage.src, 'skyblue', { scale: 10, parallax: 4 }]
}

// needs to be in a function so Next.js doesn't create the Image fills server-side when importing the module

function createImageFill(key: string): ImageFill {
    if (data[key]) {
        return ImageFill.fromSrc(...data[key])
    }
    return ImageFill.fromSrc(...data['soil']);
}

async function asyncCreateImageFill(key: string): Promise<ImageFill> {

    if (!data[key]) { key = 'neptune' }
    const params = data[key]

    const image = new Image();
    image.src = params[0];

    await new Promise(resolve => {
        image.onload = resolve;
        image.onerror = resolve;
    })

    return new ImageFill({
        image,
        fallbackColor: params[1],
        transforms: params[2]
    });
}

export {
    createImageFill, asyncCreateImageFill
}