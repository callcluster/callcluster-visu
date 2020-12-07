import createAnalysis from "./Analysis";
import Analyzable from "./Analysis/_Analyzable";
import ExtractedCommunityRepository, { ExtractedCommunity } from "./ExtractedCommunityRepository";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import makeVisualization, { Visualization, RootlessVisualization } from "./makeVisualization";
import { Community, CommunityId, CommunityIdentifier, OriginalAnalysisJson } from "./types";
import {runClustering} from "./Clusterer";
import { createCommunityInterpreter } from "./CommunityInterpreter";
import { createCommunityRepository } from "./CommunityRepository";
import { createCommunityMeasurer, OptimizingCommunityMeasurer } from "./CommunityMeasurer";
interface ClusteringParameters{
    name:string, 
    community: { 
        label:string, 
        value:number
    } 
}
export default class Controller{
    async createClustering(parameters: ClusteringParameters): Promise<ExtractedCommunity> {
        if(this.analysis===undefined){
            throw new Error("analysisjson wasn't set")
        }
        const extracted:ExtractedCommunity = this.extractedCommunitiesRepository.getRoot(parameters.community.value)
        const community:Community = this.analysis.getCommunityFromString("c"+extracted.communityId);
        const newCommunity = await runClustering(this.analysis.getCalls(community))
        console.log("new community created",newCommunity)
        this.optimizeAndAdd(newCommunity)
        const communityId = this.interpreter.getNumberIdentifier(newCommunity)
        const name = parameters.name
        return this.extractedCommunitiesRepository.createCommunity(communityId,name,"Extracted community")
    }
    private analysis:Analyzable|undefined
    private extractedCommunitiesRepository:ExtractedCommunityRepository = new ExtractedCommunityRepository()
    private interpreter = createCommunityInterpreter()
    private communityRepository = createCommunityRepository(this.interpreter)
    private measurer:OptimizingCommunityMeasurer|undefined

    public setAnalysisJson(localAnalysisJson: any){
        this.measurer = createCommunityMeasurer(localAnalysisJson.functions,this.interpreter)
        this.optimizeAndAdd(localAnalysisJson.community)
        this.analysis = createAnalysis(localAnalysisJson, this.interpreter, this.communityRepository, this.measurer)
        this.extractedCommunitiesRepository.setMinedCommunityId(this.interpreter.getNumberIdentifier(localAnalysisJson.community))
    }

    private optimizeAndAdd(community:Community){
        if(this.measurer===undefined){
            throw new Error("No measurer assigned")
        }
        this.measurer.optimize(community)
        this.communityRepository.addIndependentCommunity(community)
    }

    public makeVisualization(visualization: RootlessVisualization) {
        if(this.analysis===undefined){
            throw new Error("analysisjson wasn't set")
        }
        let root:CommunityIdentifier|undefined=undefined;
        if("root" in visualization && visualization["root"]!==undefined){
            root=visualization["root"]
        }else{
            const communityValue = visualization.parameters.community.value
            const extracted = this.extractedCommunitiesRepository.getRoot(communityValue)
            root="c"+extracted.communityId;
        }
        
        return makeVisualization({
            ...visualization,
            root
        }, this.analysis)
    }

    public getInfoFor(data:InfoQuery){
        if(this.analysis===undefined){
            throw new Error("analysisjson wasn't set")
        }
        return getInfoFor(data, this.analysis)
    }

    public getAvailableMetrics(){
        if(this.analysis===undefined){
            throw new Error("analysisjson wasn't set")
        }
        return this.analysis.getAvailableMetrics()
    }
    
    public getMinedCommunity():ExtractedCommunity {
        return this.extractedCommunitiesRepository.getMinedCommunity()
    }

    public createCommunity(communityId:number,name:string):ExtractedCommunity {
        return this.extractedCommunitiesRepository.createCommunity(communityId,name,"Extracted community")
    }

    public deleteCommunity(id: number) {
        this.extractedCommunitiesRepository.deleteCommunity(id)
    }

    public renameCommunity(id: number, name: string) {
        this.extractedCommunitiesRepository.renameCommunity(id,name)
    }
    
}