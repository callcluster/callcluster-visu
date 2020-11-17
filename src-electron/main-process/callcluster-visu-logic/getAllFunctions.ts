import { Community } from "./globals"
import getFunctions from "./getFunctions";
import getSubCommunities from "./getSubCommunities";
export default function getAllFunctions(community: Community): number[] {
    return [
        ...getFunctions(community),
        ...(
            getSubCommunities(community)
                .map(getAllFunctions)
                .reduce((a, b) => [...a, ...b], [])
        )
    ]
}