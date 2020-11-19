import getCommunity from "../../getCommunity";
import { getTreemap } from 'treemap-squarify';
import makeEvaluator from "../../makeEvaluator";
import { analysisJson } from "../../globals"
import TreemapVisualization from "./TreemapVisualization";
import { getSubjectsInside } from "./_measurables";

export default function makeTreemap(visualization: TreemapVisualization) {
    const community = getCommunity(visualization.path || [], analysisJson.community);
    const evaluator = makeEvaluator(
        visualization.parameters.scaling,
        visualization.parameters.metric
    )

    const subjects = getSubjectsInside(community, evaluator)[1]
        .filter(f => f.value != 0)
        .sort((a, b) => a.value - b.value)

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}