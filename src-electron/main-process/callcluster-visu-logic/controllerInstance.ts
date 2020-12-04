import { ExtractedCommunity } from "./CommunityRepository";
import Controller from "./Controller";
import { InfoQuery } from "./getInfoFor";
import { Visualization } from "./makeVisualization";

const controllerInstance = new Controller()

export function setAnalysisJson(localAnalysisJson: any) {
    controllerInstance.setAnalysisJson(localAnalysisJson)
}
export function getInfoFor(data: InfoQuery) {
    return controllerInstance.getInfoFor(data)
}
export function makeVisualization(visualization: Visualization) {
    return controllerInstance.makeVisualization(visualization)
}

export function getAvailableMetrics() {
    return controllerInstance.getAvailableMetrics()
}

export function createCommunity(data:{communityId:number,name:string}):ExtractedCommunity {
    return controllerInstance.createCommunity(data.communityId,data.name)
}

export function getMinedCommunity():ExtractedCommunity {
    return controllerInstance.getMinedCommunity()
}

export function renameCommunity(data:{id:number,name:string}):void {
    controllerInstance.renameCommunity(data.id,data.name)
}

export function deleteCommunity(id:number):void {
    controllerInstance.deleteCommunity(id)
}