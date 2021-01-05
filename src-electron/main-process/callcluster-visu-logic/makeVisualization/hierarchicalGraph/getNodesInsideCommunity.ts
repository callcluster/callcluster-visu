import { CommunityIdentifier, Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import { MeasurablesAnalyzer, Measurable, getMeasurablesInside } from "./_measurables";
import Node from "./Node";
import Analyzable from "./_Analyzable";
import Colorer from "./_Colorer";
function subjectToNode(subject: Measurable, parent: Community, measurablesAnalyzer: MeasurablesAnalyzer, analyzable:Analyzable): Node {
    return {
        ...subject,
        functions: measurablesAnalyzer.getAllFunctionsInside(subject),
        parent: analyzable.getStringIdentifier(parent),
        color: analyzable.getColor(parent)
    }
}
export default function getNodesInsideCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator, analyzable: Analyzable, colorer:Colorer|null): Node[] {

    const [nodesAnalyzer, subjects] = getMeasurablesInside(community, evaluator, analyzable, colorer)

    return subjects
        .filter(subject => !nodesAnalyzer.identifierIncluded(subject, excludedIds))
        .map(subject => subjectToNode(subject, community, nodesAnalyzer, analyzable))
}