import { PartialSubject } from "./PartialSubject";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import { Community } from "../../globals"
import getTreemapId from "../../getTreemapId";
import getAllFunctions from "../../getAllFunctions";
export default function getSubjectForCommunity(community: Community, evaluator: SubjectEvaluator, includeFunctions:boolean = false): PartialSubject {
    return {
        ...community,
        id: `c${getTreemapId(community)}`,
        communities: undefined,
        functions: includeFunctions ? 
            new Set(getAllFunctions(community)):
            new Set(),
        type: "community",
        value: evaluator(community),
        name: community.name
    }
}