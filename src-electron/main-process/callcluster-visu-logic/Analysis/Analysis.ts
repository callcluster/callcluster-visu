import { Metric, CommunityName, Call, Community, Function, OriginalAnalysisJson, FunctionId, CommunityId } from "./_types";
import Analyzable from "./_Analyzable";
import getCommunityFromPath from "./getCommunity";
import Indexer from "./Indexer";

export default class Analysis implements Analyzable {
    private communityIndex:Indexer<Community>=new Indexer<Community>()
    constructor( private analysisJson:OriginalAnalysisJson  ) {}
    getMinedCommunity(): Community {
        return this.analysisJson.community
    }
    getColor(community: Community): string {
        const seed = community["_treemap_id"] as number
        return "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
    }
    getFunctionId(id: string):FunctionId {
        return parseInt(id.replace("f","")) as unknown as FunctionId
    }
    getCommunityFromString(id: string):Community {
        return this.communityIndex.get(parseInt(id.replace("c","")))
    }
    getCommunity(id: CommunityId): Community {
        return this.communityIndex.get(id as unknown as number)
    }
    getCommunityAt(path: CommunityName[]): Community {
        return getCommunityFromPath(path,this.analysisJson.community, this)
    }
    getWrittenFunctions():Function[] {
        return this.analysisJson["functions"].filter(this.isWritten)
    }
    getFunction(id:FunctionId):Function{
        return this.analysisJson.functions[id as unknown  as number];
    }
    getCalls():Call[]{
        return this.analysisJson.calls
    }
    getMetric(subject: Function | Community, metric: Metric): number|undefined {
        if (metric in subject) {
            return subject[metric] as number
        } else {
            return undefined
        }
    }
    getSubCommunities(c: Community): Community[] {
        if ("communities" in c) {
            return c.communities as Community[];
        } else {
            throw Error("Cannot get subcommunities of a community")
        }
    }
    getFunctionsInside(community: Community): FunctionId[] {
        if ("functions" in community) {
            return community["functions"] as FunctionId[]
        } else {
            throw Error("This community has no functions")
        }
    }
    getStringIdentifier(identifiable: Community|FunctionId):string {
        if(Number.isInteger(identifiable)){
            return `f${identifiable}`
        }
        if ("_treemap_id" in identifiable) {
            return `c${identifiable["_treemap_id"] as number}`
        }

        throw Error("This identifiable has no identifier")
    }
    isAbstract(community: Community): boolean {
        return (
            this.getSubCommunities(community).length == 0
            &&
            this.getFunctionsInside(community).every(
                f => !this.isWritten(this.getFunction(f))
            )
        )
    }
    isWritten(func: Function): boolean {
        return func.written == undefined || func.written == true;
    }
    getAvailableMetrics(): Metric[] {
        let metricsDict: Record<string, boolean> = {}
        this.analysisJson.functions.forEach(f => {
            Object.keys(f)
                .filter(k => {
                    return Number.isFinite(f[k])
                })
                .forEach(k => {
                    metricsDict[k] = true
                });
        });
        return Object.keys(metricsDict).filter(v => !['location', 'name', 'written'].includes(v))
    }
    addToMetric(community: Community, metric: Metric, value: number): number {
        const gotMetric = this.getMetric(community, metric) ?? 0
        const sum = gotMetric + value
        community[metric] = sum
        return sum
    }

    optimize(community: Community|null = null, metrics: Metric[]|null = null) {
        if(community==null){
            this.optimize(this.analysisJson.community,metrics)
            return
        }
        if(metrics==null){
            this.optimize(community,this.getAvailableMetrics())
            return
        }

        community._treemap_id = this.communityIndex.nextId
        this.communityIndex.add(community)
    
        this.getSubCommunities(community)
            .forEach(childCommunity => 
                this.optimize(childCommunity, metrics)
            )
    
        this.getSubCommunities(community)
            .forEach(childCommunity => 
                metrics.forEach(m => 
                    this.addToMetric(community, m, this.getMetric(childCommunity, m) ?? 0)
                )
            )
    
        this.getFunctionsInside(community)
            .map(id => this.getFunction(id))
            .forEach(func => metrics.forEach(metric =>
                this.addToMetric(community, metric, this.getMetric(func, metric) ?? 0)
            ))
    }
}