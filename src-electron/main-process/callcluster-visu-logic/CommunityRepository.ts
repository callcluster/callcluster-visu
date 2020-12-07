import CommunityInterpreter from "./Analysis/_CommunityInterpreter";
import Indexer from "./Indexer";
import { Community, CommunityId, CommunityIdentifier } from "./types";

export default interface CommunityRepository{
    getParent(community: Community): Community | null
    getCommunityFromString(id: CommunityIdentifier):Community
    getCommunity(id: CommunityId): Community
    getMinedCommunity(): Community
}

export interface MutableCommunityRepository extends CommunityRepository{
    optimize():void
}

class ConcreteCommunityRepository implements MutableCommunityRepository{
    private communityIndex:Indexer<Community>=new Indexer<Community>()
    private parents:Map<string,Community> = new Map<string,Community>();
    constructor(private communityInterpreter:CommunityInterpreter, private minedCommunity:Community) {}

    getMinedCommunity(): Community {
        return this.minedCommunity
    }
    
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

    optimize() {
        this.indexCommunities(this.minedCommunity)
        this.optimizeGetParents(this.minedCommunity)
    }
}

export function createCommunityRepository(interpreter:CommunityInterpreter, minedCommunity:Community):MutableCommunityRepository{
    return new ConcreteCommunityRepository(interpreter, minedCommunity)
}