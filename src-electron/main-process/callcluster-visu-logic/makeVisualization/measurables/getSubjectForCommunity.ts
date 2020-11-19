import { Measurable } from "./PartialSubject";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import { Community } from "../../globals"
import getTreemapId from "../../getTreemapId";
export default function getSubjectForCommunity(community: Community, evaluator: SubjectEvaluator): Measurable {
    return {
        ...community,
        id: `c${getTreemapId(community)}`,
        communities: undefined,
        functions: undefined,
        type: "community",
        value: evaluator(community),
        name: community.name
    }
}