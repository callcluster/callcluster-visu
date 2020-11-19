import { Community, analysisJson } from "../../globals";
import { CommunityIdentifier } from "../../CommunityIdentifier";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import getColor from "../../getColor";
import getTreemapId from "../../getTreemapId";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside } from "./_measurables";
import Node from "./Node";

function subjectToNode(subject: Measurable, parent: Community, analyzer: MeasurablesAnalyzer): Node {
    return {
        ...subject,
        functions: analyzer.getAllFunctionsInside(subject),
        parent: `c${getTreemapId(parent)}`,
        color: getColor(getTreemapId(parent))
    }
}
export default function getNodesForCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator): Node[] {

    const [analyzer, subjects] = getMeasurablesInside(community, evaluator)

    return subjects
        .filter(subject => !analyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, analyzer))
}