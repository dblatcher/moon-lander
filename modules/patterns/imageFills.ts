import { ImageFill, Geometry } from "physics-worlds";

import soilImage from "../../image/soil.jpg";
import jupiterImage from "../../image/jupiter.jpg";
import neptuneImage from "../../image/neptune.jpg";
import brickImage from "../../image/brick.png";
import skyImage from "../../image/clouds.png";

// TO DO - make these types importable in physics-worlds
interface ImageFillTransforms {
    scale?: number
    rotate?: number
    parallax?: number
    offset?: Geometry.Vector
}
type ImageFillParameters =  [string, string, ImageFillTransforms]

type AvailableFillImage = 'soil' | 'jupiter' | 'neptune' | 'brick' | 'sky';

const data: { [index: string]: ImageFillParameters } = {
    soil: [soilImage.src, 'brown', { scale: 1, rotate: 30 }],
    jupiter: [jupiterImage.src, 'orange', { scale: 10 }],
    neptune: [neptuneImage.src, 'blue', { scale: 3 }],
    brick: [brickImage.src, 'red', { scale: .5 }],
    sky: [skyImage.src, 'skyblue', { scale: 10, parallax: 4 }]
}

// needs to be in a function so Next.js doesn't create the Image fills server-side when importing the module

function createImageFill(key: AvailableFillImage): ImageFill {
    if (data[key]) {
        return ImageFill.fromSrc(...data[key])
    }
    return ImageFill.fromSrc(...data['soil']);
}

async function loadImageFill(
    key: AvailableFillImage,
    fallbackColor?: string,
    imageFillTransforms?: ImageFillTransforms
): Promise<ImageFill> {

    if (!data[key]) { key = 'neptune' }
    const params: ImageFillParameters = [
        data[key][0],
        fallbackColor || data[key][1],
        imageFillTransforms || data[key][2],
    ]

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

async function loadManyImageFills(inputs: (AvailableFillImage|[AvailableFillImage, string?, ImageFillTransforms?])[]): Promise<ImageFill[]> {
    return await Promise.all(inputs.map(key => { 
        if ( typeof key == 'string') {
            return loadImageFill(key) 
        } else {
            return loadImageFill(...key);
        }
    }));
}

export {
    createImageFill, loadImageFill, loadManyImageFills
}