import { Community, analysisJson } from "../../globals";
import { CommunityIdentifier } from "../../CommunityIdentifier";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import getFunctions from "../../getFunctions";
import getSubCommunities from "../../getSubCommunities";
import isWritten from "../../isWritten"
import getSubjectForFunction from "../measurables/getSubjectForFunction";
import getSubjectForCommunity from "../measurables/getSubjectForCommunity";
import isAbstract from "../../isAbstract";
import getTreemapId from "../../getTreemapId";
import getColor from "../../getColor";
export default function getNodesForCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator) {
    return [
        ...getFunctions(community)
            .filter(fid => isWritten(analysisJson.functions[fid]))
            .map(id => getSubjectForFunction(id, evaluator)),
        ...getSubCommunities(community)
            .filter((c) => !excludedIds.includes("c" + getTreemapId(c)))
            .filter(c => !isAbstract(c))
            .map(c => getSubjectForCommunity(c,evaluator,true)),
    ].map(n => ({
        ...n,
        parent: `c${getTreemapId(community)}`,
        color: getColor(getTreemapId(community))
    }))

}