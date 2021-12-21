import { ImageFill } from "../../../worlds";

import soilImage from "../../image/soil.jpg";
import jupiterImage from "../../image/jupiter.jpg";
import neptuneImage from "../../image/neptune.jpg";



const soil = ImageFill.fromSrc(soilImage.src, 'brown', {scale:1, rotate:30});
const jupiter = ImageFill.fromSrc(jupiterImage.src, 'orange', {scale:10});
const neptune = ImageFill.fromSrc(neptuneImage.src, 'blue', {scale:3});


export {
    soil, jupiter, neptune,
}