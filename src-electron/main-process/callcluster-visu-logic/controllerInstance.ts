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

export function createCommunity(data:{communityId:number,name:string}) {
    console.log("-----")
    console.log("-----")
    console.log(data)
    console.log("-----")
    console.log("-----")
    return {
        id: 20,
        communityId: data.communityId,
        name: data.name,
        description: "Extracted community",
    }
}

export function getMinedCommunity() {
    return {
        id: 0,
        name: "Mined community",
        description: "Mined community",
    }
}

export function renameCommunity(data:{id:number,name:string}){
    console.log("=====")
    console.log(data)
    console.log("=====")
    
    return data;
}

export function deleteCommunity(id:number){
    console.log("delete!")
    console.log(id)
}