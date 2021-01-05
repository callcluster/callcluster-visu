import CommunityInterpreter from "./Analysis/_CommunityInterpreter";
import Indexer from "./Indexer";
import { Community, CommunityId, CommunityIdentifier, FunctionId } from "./types";

export default interface CommunityRepository{
    findCommunityFor(id: FunctionId, rootCommunity: Community): Community|undefined;
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
    private functionParents:Map<string,Map<number,Community>>= new Map<string,Map<number,Community>>();

    constructor(private communityInterpreter:CommunityInterpreter) {}
    findCommunityFor(id: FunctionId, rootCommunity: Community): Community|undefined {
        const identifier = this.communityInterpreter.getStringIdentifier(rootCommunity)
        return this.functionParents.get(identifier)?.get(id as unknown as number)
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

    private optimizeGetParents(community: Community, rootCommunity:Community){
        this.communityInterpreter.getSubCommunities(community)
        .forEach(childCommunity => {
            const com = this.communityInterpreter.getStringIdentifier(childCommunity)
            this.parents.set(com, community)
        })
        const rootCommunityIdentifier = this.communityInterpreter.getStringIdentifier(rootCommunity)
        if(!this.functionParents.has(rootCommunityIdentifier)){
            this.functionParents.set(rootCommunityIdentifier,new Map<number,Community>())
        }
        this.communityInterpreter.getFunctionsInside(community)
        .forEach(fid => {
            this.functionParents.get(rootCommunityIdentifier)?.set(fid as unknown as number, community)
        })
        this.communityInterpreter.getSubCommunities(community)
        .forEach(childCommunity => {
            this.optimizeGetParents(childCommunity,rootCommunity)
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
        this.optimizeGetParents(communityRoot,communityRoot)
    }
}

export function createCommunityRepository(interpreter:CommunityInterpreter):MutableCommunityRepository{
    return new ConcreteCommunityRepository(interpreter)
}