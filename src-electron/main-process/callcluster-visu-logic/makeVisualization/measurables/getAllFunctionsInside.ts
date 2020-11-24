import { Community } from "./_types"
import getFunctionsInside from "../../getFunctionsInside";
import Analyzable from "./_Analyzable";
export default function getAllFunctionsInside(community: Community, analysis:Analyzable): number[] {
    return [
        ...getFunctionsInside(community),
        ...(
            analysis.getSubCommunities(community)
                .map((community)=>getAllFunctionsInside(community,analysis))
                .reduce((a, b) => [...a, ...b], [])
        )
    ]
}