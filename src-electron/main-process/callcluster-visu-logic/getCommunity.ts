import { Community } from "./globals"
import { CommunityName } from "./CommunityName"
import getSubCommunities from "./getSubCommunities";

export default function getCommunity(path: CommunityName[], community: Community): Community {
    if (path.length == 0) {
        return community;
    } else {
        let communityName = path[0]
        let possibleNextCommunities = getSubCommunities(community).filter(c => c.name == communityName)
        if (possibleNextCommunities.length == 0) {
            return community;
        } else {
            return getCommunity(path.slice(1), possibleNextCommunities[0])
        }
    }
}