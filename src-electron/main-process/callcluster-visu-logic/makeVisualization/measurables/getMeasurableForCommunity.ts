import { Measurable } from "./Measurable";
import { SubjectEvaluator } from "./_makeEvaluator";
import { Community } from "./_types"
import getTreemapId from "../../getTreemapId";
export default function getMeasurableForCommunity(community: Community, evaluator: SubjectEvaluator): Measurable {
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