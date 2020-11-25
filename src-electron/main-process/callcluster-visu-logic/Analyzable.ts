import { CommunityName, Call, Community, Function, Metric } from "./types";
export default interface Analyzable {
    getCommunity(id: number):Community;
    getCommunityAt(path:CommunityName[]):Community
    getWrittenFunctions():Function[]
    getFunction(id:number):Function
    getCalls():Call[]
    getMetric(subject: Function | Community, metric: Metric): number
    getSubCommunities(c: Community): Community[]
    getFunctionsInside(community: Community): number[]
    getTreemapId(community: Community):number
    isAbstract(community: Community):boolean
    isWritten(func: Function): boolean
    getAvailableMetrics(): Metric[]
    getAvailableMetrics(): Metric[]
    addToMetric(community: Community, metric: Metric, value: number, analysis:Analyzable): number
    optimize():void
}