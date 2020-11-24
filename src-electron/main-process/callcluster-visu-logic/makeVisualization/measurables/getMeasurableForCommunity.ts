import { Measurable } from "./Measurable";
import Analyzable from "./_Analyzable";
import { SubjectEvaluator } from "./_makeEvaluator";
import { Community } from "./_types"
export default function getMeasurableForCommunity(community: Community, evaluator: SubjectEvaluator, analyzable:Analyzable): Measurable {
    return {
        ...community,
        id: `c${analyzable.getTreemapId(community)}`,
        communities: undefined,
        functions: undefined,
        type: "community",
        value: evaluator(community),
        name: community.name
    }
}