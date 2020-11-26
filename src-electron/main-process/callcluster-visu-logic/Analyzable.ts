import { CommunityName, Call, Community, Function, Metric, FunctionId, CommunityId, CommunityIdentifier } from "./types";
export default interface Analyzable {
    getFunctionId(id: CommunityIdentifier): FunctionId;
    getCommunity(id: CommunityId):Community;
    getCommunityFromString(id: CommunityIdentifier):Community;
    getCommunityAt(path:CommunityName[]):Community
    getWrittenFunctions():Function[]
    getFunction(id:FunctionId):Function
    getCalls():Call[]
    getMetric(subject: Function | Community, metric: Metric): number
    getSubCommunities(c: Community): Community[]
    getFunctionsInside(community: Community): FunctionId[]
    getTreemapId(community: Community):number
    isAbstract(community: Community):boolean
    isWritten(func: Function): boolean
    getAvailableMetrics(): Metric[]
    getAvailableMetrics(): Metric[]
    addToMetric(community: Community, metric: Metric, value: number, analysis:Analyzable): number
    optimize():void
}