import createAnalysis from "./Analysis";
import Analyzable from "./Analysis/_Analyzable";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import makeVisualization, { Visualization } from "./makeVisualization";
import { OriginalAnalysisJson } from "./types";

export default class Controller{
    private repository:Analyzable|undefined

    public setAnalysisJson(localAnalysisJson: any){
        this.repository = createAnalysis(localAnalysisJson as OriginalAnalysisJson)
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