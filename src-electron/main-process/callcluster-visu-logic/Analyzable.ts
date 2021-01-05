import { CommunityName, Call, Community, Function, Metric, FunctionId, CommunityId, CommunityIdentifier } from "./types";
import {Colorer, SubjectEvaluator, ColorInside} from "./makeVisualization"
export {Colorer, SubjectEvaluator, ColorInside}
export default interface Analyzable {
    getColorForFunction(id: FunctionId, evaluator: SubjectEvaluator, colorer: Colorer): ColorInside;
    getColorsForCommunity(community: Community, evaluator: SubjectEvaluator, colorer: Colorer | null): ColorInside[];
    getParents(root: CommunityIdentifier): { id: string; name: string; }[];
    getFunctionId(id: CommunityIdentifier): FunctionId;
    getCommunity(id: CommunityId):Community;
    getCommunityFromString(id: CommunityIdentifier):Community;
    getWrittenFunctions():Function[]
    getFunction(id:FunctionId):Function
    getCalls(community:Community):Call[]
    getMetric(subject: Function | Community, metric: Metric): number|undefined
    getSubCommunities(c: Community): Community[]
    getFunctionsInside(community: Community): FunctionId[]
    getStringIdentifier(identifiable: Community|FunctionId):string
    getColor(community: Community):string
    isAbstract(community: Community):boolean
    isWritten(func: Function): boolean
    getAvailableMetrics(): Metric[]
    getAvailableMetrics(): Metric[]
    getAllFunctionsInside(community: Community): FunctionId[]
}