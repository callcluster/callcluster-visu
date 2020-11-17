import { PartialSubject } from "./PartialSubject";
import { SubjectEvaluator } from "./SubjectEvaluator";
import { Community } from "./globals"

export default function getSubjectForCommunity(community: Community, evaluator: SubjectEvaluator): PartialSubject {
    return {
        ...community,
        id: "c" + community._treemap_id,
        communities: undefined,
        functions: undefined,
        type: "community",
        value: evaluator(community),
        name: community.name
    }
}