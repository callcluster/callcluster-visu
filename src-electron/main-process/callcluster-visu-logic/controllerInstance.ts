import Controller from "./Controller";
import { InfoQuery } from "./getInfoFor";
import { Visualization } from "./makeVisualization";

const controllerInstance = new Controller()

export function setAnalysisJson(localAnalysisJson:any){
    controllerInstance.setAnalysisJson(localAnalysisJson)
}
export function getInfoFor(data:InfoQuery){
    return controllerInstance.getInfoFor(data)
}
export function makeVisualization(visualization:Visualization){
    return controllerInstance.makeVisualization(visualization)
}

export function getAvailableMetrics(){
    return controllerInstance.getAvailableMetrics()
}