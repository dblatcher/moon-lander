import { World } from "physics-worlds";
import Indicator from "../Indicator";
import DangerMeter from "../DangerMeter";
import { getPlayerFuel, getPlayerThrust, getPlayerSpeed } from "../../modules/moon-lander/moonLanderWorldValues";

import styles from "./styles.module.scss";

export default function DashboardPanel(props: {
    world: World
}) {

    const { world } = props;

    return <div className={styles.panel}>
        <div className={styles.row}>
            <Indicator
                caption="THRUST"
                world={world}
                getValues={getPlayerThrust} />
            <Indicator
                caption="FUEL"
                meterType="GAGE"
                world={world}
                getValues={getPlayerFuel} />
            <DangerMeter
                caption="SPEED"
                world={world}
                getValues={getPlayerSpeed} />
        </div>
        <span className={styles["bottom-rivets"]}></span>
    </div>
}