import { World } from "physics-worlds";
import { useEffect, useState } from "react";


interface GetFacingAndRolling {
    (world: World): {
        facing: "RIGHT" | "LEFT";
        rolling: number;
    } | null
}



export default function RollMeter(props: {
    world: World
    getValues: GetFacingAndRolling
}) {
    const { world, getValues } = props;
    let [facing, setFacing] = useState<"RIGHT" | "LEFT" | undefined>(undefined);
    let [rolling, setRolling] = useState<number>(0);

    function getValuesWorld() {
        const values = getValues(world);
        if (!values) { return }
        setFacing(values.facing);
        setRolling(values.rolling);
    }

    useEffect(() => {
        world.emitter.on('tick', getValuesWorld)
        return () => {
            world.emitter.off('tick', getValuesWorld)
        }
    })


    return (
        <figure>
            <div><b>facing</b>{facing}</div>
            <div><b>rolling</b>{rolling.toFixed(3)}</div>
        </figure>
    )


}