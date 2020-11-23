import { Function, Community } from "../../types"
import scale from "./scale"
import getMetric from "../../getMetric";
import { SubjectEvaluator } from "./SubjectEvaluator";
import Visualization from "../Visualization";
export default function makeEvaluator(visualization:Visualization):SubjectEvaluator {
    return (s: Function | Community) => {
        return scale(
            visualization.parameters.scaling,
            getMetric(s, visualization.parameters.metric)
        )
    }
}