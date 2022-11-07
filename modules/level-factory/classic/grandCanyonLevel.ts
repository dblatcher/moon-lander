import { Force, World } from "physics-worlds";
import { Level } from "../../Level";
import { LevelIntro } from "../../LevelIntro";
import { LandingPad } from "../../world-things/LandingPad";
import { Terrain } from "../../world-things/Terrain";
import { loadManyImageFills } from "../imageFills";
import { makeShip } from "../items";
import { makeRectangleProperties } from "../../utility";

async function level(): Promise<Level> {

    const [soil, jupiter] = await loadManyImageFills(['soil','jupiter']);

    const worldDimensions = {
        width: 1000,
        height: 2500,
    }
    
    const world = new World([
        makeShip({ x:400,y:2500-1500,color:'purple'}),

        new Terrain({ x:260,y:2500-980,size:200, fillColor: soil, color: 'transparent' }),

        new Terrain({ x:0,y:2500-50, ...makeRectangleProperties(10000,50),  fillColor: soil, color: 'transparent' }),
        new Terrain({ x:0,y:2500-1450, ...makeRectangleProperties(250,1400), heading:.05, fillColor: soil, color: 'transparent' }),
        new Terrain({ x:1050,y:2500-1450, ...makeRectangleProperties(250,1000), heading:-.025, fillColor: soil, color: 'transparent' }),
        new Terrain({ x:850,y:2500-350, ...makeRectangleProperties(150,400),heading:.05, fillColor: soil, color: 'transparent' }),

        new Terrain({ x:280,y:2500-980,size:200, fillColor: soil, color: 'transparent' }),
        new Terrain({ x:760,y:2500-790,size:240, fillColor: soil, color: 'transparent' }),
        new Terrain({ x:235,y:2500-50,size:180, fillColor: soil, color: 'transparent' }),

        new LandingPad({
            x:570,y:2500-90, fillColor: 'green',
            ...makeRectangleProperties(150,10)
        }),

    ], {
        ...worldDimensions,
        gravitationalConstant: .001,
        globalGravityForce: new Force(50, 0),
        hasHardEdges: true,
        fillColor:jupiter,
    });

    const levelIntro = new LevelIntro("The Grand Canyon of Cygnus 4", "classic/3");
    return [world, levelIntro]
}

export { level }