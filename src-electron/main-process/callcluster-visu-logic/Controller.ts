import createAnalysis from "./Analysis";
import Analyzable from "./Analysis/_Analyzable";
import CommunityRepository, { ExtractedCommunity } from "./CommunityRepository";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import makeVisualization, { Visualization } from "./makeVisualization";
import { OriginalAnalysisJson } from "./types";
interface ClusteringParameters{
    name:string, 
    community: { 
        label:string, 
        value:number
    } 
}
export default class Controller{
    createClustering(data: ClusteringParameters): ExtractedCommunity {
        return {
            communityId:this.getMinedCommunity().communityId,
            description:"Clustering",
            id:89,
            name:data.name
        }
    }
    private repository:Analyzable|undefined
    private communities:CommunityRepository = new CommunityRepository()

    public setAnalysisJson(localAnalysisJson: any){
        this.repository = createAnalysis(localAnalysisJson as OriginalAnalysisJson)
        this.repository.optimize()
        this.communities.setMinedCommunityId(this.repository.getNumberIdentifier(this.repository.getMinedCommunity()))
    }

    public makeVisualization(visualization: Visualization) {
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
        }
        if(! ("root" in visualization)){
            const communityValue = visualization.parameters.community.value
            const extracted = this.communities.getRoot(communityValue)
            visualization.root="c"+extracted.communityId;
        }
        return makeVisualization(visualization, this.repository)
    }

    public getInfoFor(data:InfoQuery){
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
        }
        return getInfoFor(data, this.repository)
    }

    public getAvailableMetrics(){
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
        }
        return this.repository.getAvailableMetrics()
    }
    
    public getMinedCommunity():ExtractedCommunity {
        return this.communities.getMinedCommunity()
    }

    public createCommunity(communityId:number,name:string):ExtractedCommunity {
        return this.communities.createCommunity(communityId,name)
    }

    public deleteCommunity(id: number) {
        this.communities.deleteCommunity(id)
    }

    public renameCommunity(id: number, name: string) {
        this.communities.renameCommunity(id,name)
    }
    
}