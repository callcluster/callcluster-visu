import { Measurable } from "./Measurable";
import Analyzable from "./_Analyzable";
import { SubjectEvaluator } from "./_makeEvaluator";
import { Community } from "./_types"
import Colorer from "./_Colorer";

export default function getMeasurableForCommunity(community: Community, evaluator: SubjectEvaluator, analyzable:Analyzable, colorer:Colorer|null): Measurable {
    return {
        ...community,
        id: analyzable.getStringIdentifier(community),
        communities: undefined,
        functions: undefined,
        type: "community",
        value: evaluator(community),
        name: community.name,
        colorsInside:[]
    }
}