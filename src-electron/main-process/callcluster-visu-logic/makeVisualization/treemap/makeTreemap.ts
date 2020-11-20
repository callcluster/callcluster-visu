import { getTreemap } from 'treemap-squarify';
import makeEvaluator from "../../makeEvaluator";
import TreemapVisualization from "./TreemapVisualization";
import { getMeasurablesInside } from "./_measurables";
import Analyzable from "../../Analyzable";

export default function makeTreemap(visualization: TreemapVisualization, analyzable:Analyzable) {
    const community = analyzable.getCommunity(visualization.path || [])
    const evaluator = makeEvaluator(
        visualization.parameters.scaling,
        visualization.parameters.metric
    )

    const subjects = getMeasurablesInside(community, evaluator, analyzable)[1]
        .filter(f => f.value != 0)
        .sort((a, b) => a.value - b.value)

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}