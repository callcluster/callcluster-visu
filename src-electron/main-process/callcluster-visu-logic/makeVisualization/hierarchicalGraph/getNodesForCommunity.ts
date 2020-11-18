import { Community, analysisJson } from "../../globals";
import { CommunityIdentifier } from "../../CommunityIdentifier";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import getFunctions from "../../getFunctions";
import getSubCommunities from "../../getSubCommunities";
import isWritten from "../../isWritten"
import getSubjectForFunction from "../../getSubjectForFunction";
import isAbstract from "../../isAbstract";
import getTreemapId from "../../getTreemapId";
import getAllFunctions from "../../getAllFunctions";
import getColor from "../../getColor";
export default function getNodesForCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator) {
    return [
        ...getFunctions(community)
            .filter(fid => isWritten(analysisJson.functions[fid]))
            .map(id => {
                const subject = getSubjectForFunction(id, evaluator);
                return ({
                    ...subject,
                    functions: new Set([id]),
                    name: subject.name
                })

            }),
        ...getSubCommunities(community)
            .filter((c) => !excludedIds.includes("c" + getTreemapId(c)))
            .filter(c => !isAbstract(c))
            .map(c => {
                let ret = { ...c }
                let totalFunctions = getAllFunctions(c)
                delete ret.communities
                delete ret.functions
                delete ret.id
                return {
                    ...ret,
                    value: evaluator(c),
                    id: `c${getTreemapId(c)}`,
                    functions: new Set(totalFunctions),
                    name: ret.name
                }
            }),
    ].map(n => ({
        ...n,
        parent: `c${getTreemapId(community)}`,
        color: getColor(getTreemapId(community))
    }))

}