import Indexer from "./Indexer";
export default class ExtractedCommunityRepository{
    private repository = new Indexer<ExtractedCommunity>()
    private minedCommunityId: number|undefined;

    getRoot(id: number):ExtractedCommunity {
        return this.repository.get(id)
    }

    renameCommunity(id: number, name: string) {
        this.repository.get(id).name=name
    }

    deleteCommunity(id: number) {
        this.repository.remove(id)
    }

    createCommunity(communityId: number, name: string, description:string): ExtractedCommunity {
        const community:ExtractedCommunity = {
            id:this.repository.nextId,
            description: description,
            name,
            communityId
        }
        this.repository.add(community)
        return community
    }

    getMinedCommunity():ExtractedCommunity{
        if(this.minedCommunityId===undefined){
            throw new Error("The mined community was not set")
        }
        return this.repository.get(this.minedCommunityId)
    }
    
    setMinedCommunityId(id:number){
        this.minedCommunityId=this.repository.nextId
        this.repository.add({
            communityId:id,
            description:"Mined community",
            name:"Mined community",
            id:this.minedCommunityId
        })
    }
}

export interface ExtractedCommunity {
    id: number,
    name: string,
    description: string,
    communityId: number
}