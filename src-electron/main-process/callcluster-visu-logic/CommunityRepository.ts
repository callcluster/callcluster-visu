import CommunityInterpreter from "./Analysis/_CommunityInterpreter";
import Indexer from "./Indexer";
import { Community, CommunityId, CommunityIdentifier } from "./types";

export default interface CommunityRepository{
    getParent(community: Community): Community | null
    getCommunityFromString(id: CommunityIdentifier):Community
    getCommunity(id: CommunityId): Community
}

export interface MutableCommunityRepository extends CommunityRepository{
    addIndependentCommunity(communityRoot:Community):void
}

class ConcreteCommunityRepository implements MutableCommunityRepository{
    private communityIndex:Indexer<Community>=new Indexer<Community>()
    private parents:Map<string,Community> = new Map<string,Community>();
    constructor(private communityInterpreter:CommunityInterpreter) {}

    getParent(community: Community): Community | null {
        const stringIdentifier = this.communityInterpreter.getStringIdentifier(community)
        return this.parents.get(stringIdentifier) ?? null
    }

    getCommunityFromString(id: CommunityIdentifier):Community {
        return this.communityIndex.get(parseInt(id.replace("c","")))
    }
    
    getCommunity(id: CommunityId): Community {
        return this.communityIndex.get(id as unknown as number)
    }

    private optimizeGetParents(community: Community){
        this.communityInterpreter.getSubCommunities(community)
        .forEach(childCommunity => {
            const com = this.communityInterpreter.getStringIdentifier(childCommunity)
            this.parents.set(com, community)
        })
        this.communityInterpreter.getSubCommunities(community)
        .forEach(childCommunity => {
            this.optimizeGetParents(childCommunity)
        })
    }

    private indexCommunities(community: Community){
        community._treemap_id = this.communityIndex.nextId
        this.communityIndex.add(community)
        this.communityInterpreter.getSubCommunities(community)
            .forEach(childCommunity => 
                this.indexCommunities(childCommunity)
            )
    }

    addIndependentCommunity(communityRoot:Community):void{
        this.indexCommunities(communityRoot)
        this.optimizeGetParents(communityRoot)
    }
}

export function createCommunityRepository(interpreter:CommunityInterpreter):MutableCommunityRepository{
    return new ConcreteCommunityRepository(interpreter)
}