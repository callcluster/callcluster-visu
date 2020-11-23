import { Metric, Function, Community } from "./types"
import scale,{Scaling} from "./scale"
import getMetric from "./getMetric";
export default function makeEvaluator(scaling: Scaling, metric: Metric) {
    return (s: Function | Community) => {
        return scale(
            scaling,
            getMetric(s, metric)
        )
    }
}