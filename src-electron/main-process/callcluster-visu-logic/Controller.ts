import createAnalysis from "./Analysis";
import Analyzable from "./Analysis/_Analyzable";
import ExtractedCommunityRepository, { ExtractedCommunity } from "./ExtractedCommunityRepository";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import makeVisualization, { Visualization, RootlessVisualization } from "./makeVisualization";
import { CommunityIdentifier, OriginalAnalysisJson } from "./types";
import {runClustering} from "./Clusterer";
import { createCommunityInterpreter } from "./CommunityInterpreter";
import { createCommunityRepository } from "./CommunityRepository";
interface ClusteringParameters{
    name:string, 
    community: { 
        label:string, 
        value:number
    } 
}
export default class Controller{
    async createClustering(parameters: ClusteringParameters): Promise<ExtractedCommunity> {
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
        }
        const communityValue = parameters.community.value
        const extracted = this.communities.getRoot(communityValue)
        const root="c"+extracted.communityId;
        const community=this.repository.getCommunityFromString(root);
        const calls=this.repository.getCalls(community)
        const newCommunity = await runClustering(calls)
        console.log("new community created",newCommunity)

        return {
            communityId:this.getMinedCommunity().communityId,
            description:"Clustering",
            id:89,
            name:parameters.name
        }
    }
    private repository:Analyzable|undefined
    private communities:ExtractedCommunityRepository = new ExtractedCommunityRepository()

    public setAnalysisJson(localAnalysisJson: any){
        const communityRepository = createCommunityRepository(createCommunityInterpreter(),localAnalysisJson.community)
        communityRepository.optimize()
        this.repository = createAnalysis(localAnalysisJson, createCommunityInterpreter(),communityRepository)
        this.repository.optimize()
        this.communities.setMinedCommunityId(this.repository.getNumberIdentifier(this.repository.getMinedCommunity()))
    }

    public makeVisualization(visualization: RootlessVisualization) {
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
        }
        let root:CommunityIdentifier|undefined=undefined;
        if("root" in visualization && visualization["root"]!==undefined){
            root=visualization["root"]
        }else{
            const communityValue = visualization.parameters.community.value
            const extracted = this.communities.getRoot(communityValue)
            root="c"+extracted.communityId;
        }
        
        return makeVisualization({
            ...visualization,
            root
        }, this.repository)
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