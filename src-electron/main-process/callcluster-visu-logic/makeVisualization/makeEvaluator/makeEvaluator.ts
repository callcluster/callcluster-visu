import { Function, Community } from "./_types"
import scale from "./scale"
import { SubjectEvaluator } from "./SubjectEvaluator";
import Visualization from "../Visualization";
import Analyzable from "../_Analyzable";
export default function makeEvaluator(visualization:Visualization, analysis:Analyzable):SubjectEvaluator {
    return (s: Function | Community) => {
        return scale(
            visualization.parameters.scaling,
            analysis.getMetric(s, visualization.parameters.metric)
        )
    }
}