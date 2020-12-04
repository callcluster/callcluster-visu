export default class CommunityRepository{
    minedCommunityId: number|undefined;

    renameCommunity(id: number, name: string) {
        console.log("Renaming this community!",id,name)
    }
    deleteCommunity(id: number) {
        console.log("Deleting this community!",id)
    }
    createCommunity(communityId: number, name: string): ExtractedCommunity {
        return {
            id: 20,
            name: name,
            description: "Extracted community",
            communityId: communityId,
        }
    }
    getMinedCommunity():ExtractedCommunity{
        if(this.minedCommunityId===undefined){
            throw new Error("The mined community was not set")
        }
        return {
            id: 0,
            name: "Mined community",
            description: "Mined community",
            communityId:this.minedCommunityId,
        }
    }
    setMinedCommunityId(id:number){
        this.minedCommunityId=id
    }
}

export interface ExtractedCommunity {
    id: number,
    name: string,
    description: string,
    communityId: number
}