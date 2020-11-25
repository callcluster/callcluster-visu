import Analysis from "./Analysis";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import Indexer from "./Indexer";
import makeVisualization, { Visualization } from "./makeVisualization";
import { Community, OriginalAnalysisJson } from "./types";

export default class Controller{
    private repository:Analysis|undefined

    public setAnalysisJson(localAnalysisJson: any){
        let communityIndex = new Indexer<Community>();
        this.repository = new Analysis(localAnalysisJson as OriginalAnalysisJson,communityIndex)
        this.repository.optimize()
    }

    public makeVisualization(visualization: Visualization) {
        if(this.repository===undefined){
            throw new Error("analysisjson wasn't set")
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
    
}