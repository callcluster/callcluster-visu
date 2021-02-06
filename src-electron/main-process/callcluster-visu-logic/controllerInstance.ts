import { ExtractedCommunity } from "./ExtractedCommunityRepository";
import Controller from "./Controller";
import { InfoQuery } from "./getInfoFor";
import { Visualization } from "./makeVisualization";
import {ContentsQuery} from "./listContentsFor";
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

export async function createClustering(data:any):Promise<ExtractedCommunity> {
    return controllerInstance.createClustering(data)
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

export function listContentsFor(query:ContentsQuery) {
    return controllerInstance.listContentsFor(query)
}

