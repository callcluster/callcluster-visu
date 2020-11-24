import { Community } from "./_types"
import getFunctionsInside from "../../getFunctionsInside";
import getSubCommunities from "../../getSubCommunities";
export default function getAllFunctionsInside(community: Community): number[] {
    return [
        ...getFunctionsInside(community),
        ...(
            getSubCommunities(community)
                .map(getAllFunctionsInside)
                .reduce((a, b) => [...a, ...b], [])
        )
    ]
}