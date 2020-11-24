import { Community } from "../../types";
import { CommunityIdentifier } from "../../CommunityIdentifier";
import { SubjectEvaluator } from "./_makeEvaluator";
import getColor from "./getColor";
import getTreemapId from "../../getTreemapId";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside } from "./_measurables";
import Node from "./Node";
import Analyzable from "./_Analyzable";

function subjectToNode(subject: Measurable, parent: Community, analyzer: MeasurablesAnalyzer): Node {
    return {
        ...subject,
        functions: analyzer.getAllFunctionsInside(subject),
        parent: `c${getTreemapId(parent)}`,
        color: getColor(getTreemapId(parent))
    }
}
export default function getNodesInsideCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator, analyzable: Analyzable): Node[] {

    const [nodesAnalyzer, subjects] = getMeasurablesInside(community, evaluator, analyzable)

    return subjects
        .filter(subject => !nodesAnalyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, nodesAnalyzer))
}