import { CommunityIdentifier, Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import getColor from "./getColor";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside } from "./_measurables";
import Node from "./Node";
import Analyzable from "./_Analyzable";

function subjectToNode(subject: Measurable, parent: Community, measurablesAnalyzer: MeasurablesAnalyzer, analyzable:Analyzable): Node {
    return {
        ...subject,
        functions: measurablesAnalyzer.getAllFunctionsInside(subject),
        parent: `c${analyzable.getTreemapId(parent)}`,
        color: getColor(analyzable.getTreemapId(parent))
    }
}
export default function getNodesInsideCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator, analyzable: Analyzable): Node[] {

    const [nodesAnalyzer, subjects] = getMeasurablesInside(community, evaluator, analyzable)

    return subjects
        .filter(subject => !nodesAnalyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, nodesAnalyzer, analyzable))
}