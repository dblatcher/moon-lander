import { Geometry, Shape, shapes } from "physics-worlds"
import { Point } from "physics-worlds/dist/src/geometry"


function makeRectangleProperties(width: number, height: number): {
    size: number,
    corners: Geometry.Point[]
    shape: Shape
} {

    let size: number
    let corners: Point[]
    let aspect: number
    if (width > height) {

        size = width
        aspect = height / width

        corners = [
            { x: -1, y: -aspect },
            { x: 1, y: -aspect },
            { x: 1, y: aspect },
            { x: -1, y: aspect },
        ]
    } else {
        size = height
        aspect = width / height

        corners = [
            { x: -aspect, y: -1 },
            { x: aspect, y: -1 },
            { x: aspect, y: 1 },
            { x: -aspect, y: 1 },
        ]
    }

    return { shape: shapes.polygon, size, corners }
}

export { makeRectangleProperties }