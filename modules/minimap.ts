import { RenderTransformationRule, Body, ViewPort, shapes, RenderFunctions, Area } from "physics-worlds"
import { RefuelPad } from "./world-things/LandingPad";


const makeTerrainBlack = new RenderTransformationRule(
    thing => (thing as Body | Area).typeId === 'Terrain',
    (thing, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = thing.duplicate();

        duplicate.data.color = "black";
        duplicate.data.fillColor = "black"
        duplicate.renderOnCanvas(ctx, viewPort)
    }
)

const highlightLandingPad = new RenderTransformationRule(
    thing => (thing as Body | Area).typeId === 'LandingPad',
    (body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {
        const duplicate: Body = body.duplicate();

        duplicate.data.color = "rgb(0,255,0)";
        duplicate.data.fillColor = "rgb(0,255,0)";
        duplicate.renderOnCanvas(ctx, viewPort)

        const circleFill = Date.now() % 1000 > 500 ? "white" : undefined;

        RenderFunctions.renderCircle.onCanvas(ctx,
            { x: body.data.x, y: body.data.y, radius: viewPort.visibleLineWidth * 10 },
            { strokeColor: circleFill, lineWidth: viewPort.pointRadius },
            viewPort);
    }
)

const highlightRefuelPad = new RenderTransformationRule(
    thing => (thing as Body | Area).typeId === 'RefuelPad',
    (body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

        const pad = body as RefuelPad;
        const duplicate: RefuelPad = pad.duplicate();

        const color = Date.now() % 500 > 200 ? "rgb(255,0,0)" : "rgb(255,255,255)";

        duplicate.data.color = color;
        duplicate.data.fillColor = color;
        duplicate.data.renderIndicator = false;

        duplicate.renderOnCanvas(ctx, viewPort)
    }
)

const spaceShipIsRedCircle = new RenderTransformationRule(
    thing => (thing as Body | Area).typeId === 'SpaceShip',
    (body, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

        const marker = new Body({
            x: body.data.x,
            y: body.data.y,
            fillColor: 'red',
            size: viewPort.pointRadius * 15,
            shape: shapes.circle,
        })
        marker.renderOnCanvas(ctx, viewPort)


        const circleRadius = 3 + Math.floor(Date.now() % 500 / 50);
        RenderFunctions.renderCircle.onCanvas(ctx,
            { x: body.data.x, y: body.data.y, radius: viewPort.visibleLineWidth * circleRadius },
            { strokeColor: "white", lineWidth: viewPort.pointRadius },
            viewPort);
    }
)

const noAreas = new RenderTransformationRule(
    thing => thing instanceof (Area),
    (area, ctx: CanvasRenderingContext2D, viewPort: ViewPort) => {

    }
)

export {
    makeTerrainBlack, spaceShipIsRedCircle, highlightLandingPad, noAreas, highlightRefuelPad
}