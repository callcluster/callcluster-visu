import Analyzable from "./_Analyzable";
import { CommunityName, Community } from "./_types"

export default function getCommunity(path: CommunityName[], community: Community, analysis:Analyzable): Community {
    if (path.length == 0) {
        return community;
    } else {
        let communityName = path[0]
        let possibleNextCommunities = analysis.getSubCommunities(community).filter(c => c.name == communityName)
        if (possibleNextCommunities.length == 0) {
            return community;
        } else {
            return getCommunity(path.slice(1), possibleNextCommunities[0], analysis)
        }
    }
}