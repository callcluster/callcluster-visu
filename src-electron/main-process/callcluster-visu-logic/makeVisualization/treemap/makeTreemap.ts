import { getTreemap, HasValue } from 'treemap-squarify';
import makeEvaluator from "./_makeEvaluator";
import TreemapVisualization from "./TreemapVisualization";
import { getMeasurablesInside } from "./_measurables";
import Analyzable from "./_Analyzable";

export default function makeTreemap(visualization: TreemapVisualization, analyzable:Analyzable) {
    const community = analyzable.getCommunityAt(visualization.path || [])
    const evaluator = makeEvaluator(visualization, analyzable)

    const subjects = getMeasurablesInside(community, evaluator, analyzable)[1]
        .filter(f => f.value!==undefined && f.value>0)
        .sort((a, b) => (a.value as number) - (b.value as number))

    return getTreemap({
        data: subjects as HasValue[],
        width: 100,
        height: 100
    });
}