import { Community, FunctionId } from "./_types"
import Analyzable from "./_Analyzable";
export default function getAllFunctionsInside(community: Community, analysis:Analyzable): FunctionId[] {
    return [
        ...analysis.getFunctionsInside(community),
        ...(
            analysis.getSubCommunities(community)
                .map((community)=>getAllFunctionsInside(community,analysis))
                .reduce((a, b) => [...a, ...b], [])
        )
    ]
}