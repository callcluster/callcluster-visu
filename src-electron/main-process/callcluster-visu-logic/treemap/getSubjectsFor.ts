import getCommunity from "../getCommunity";
import { getTreemap } from 'treemap-squarify';
import makeEvaluator from "../makeEvaluator";
import getFunctions from "../getFunctions";
import getSubjectForFunction from "../getSubjectForFunction";

import { analysisJson } from "../globals"
import TreemapVisualization from "./TreemapVisualization";
import getSubCommunities from "../getSubCommunities";
import getSubjectForCommunity from "./getSubjectForCommunity";

export default function getSubjectsFor(visualization: TreemapVisualization) {
    const community = getCommunity(visualization.path || [], analysisJson.community);
    const evaluator = makeEvaluator(
        visualization.parameters.scaling,
        visualization.parameters.metric
    )

    const subjects = [
        ...getFunctions(community)
            .map((fid) => getSubjectForFunction(fid, evaluator)),
        ...getSubCommunities(community)
            .map((c) => getSubjectForCommunity(c, evaluator)),
    ]
        .filter(f => f.value != 0)
        .sort((a, b) => a.value - b.value)

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}