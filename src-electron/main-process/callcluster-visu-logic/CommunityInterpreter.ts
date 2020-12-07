import { Community, FunctionId } from "./types";

export default interface CommunityInterpreter{
    getSubCommunities(c: Community): Community[]
    getFunctionsInside(community: Community): FunctionId[]
    getNumberIdentifier(community:Community):number
}


class ConcreteCommunityInterpreter implements CommunityInterpreter{
    getSubCommunities(c: Community): Community[] {
        if ("communities" in c) {
            return c.communities as Community[];
        } else {
            throw Error("Cannot get subcommunities of a community")
        }
    }
    getFunctionsInside(community: Community): FunctionId[] {
        if ("functions" in community) {
            return community["functions"] as FunctionId[]
        } else {
            throw Error("This community has no functions")
        }
    }
    getNumberIdentifier(community:Community):number{
        if ("_treemap_id" in community) {
            return community["_treemap_id"] as number
        }else{
            throw Error("This community has no identifier")
        }
    }
}

export function createCommunityInterpreter():CommunityInterpreter{
    return new ConcreteCommunityInterpreter();
}