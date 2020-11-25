import { Metric, CommunityName, Call, Community, Function, OriginalAnalysisJson } from "./_types";
import Analyzable from "../Analyzable";
import getCommunity from "./getCommunity";
import Indexer from "../Indexer";

export default class Analysis implements Analyzable {
    constructor( private analysisJson:OriginalAnalysisJson, private communityIndex:Indexer<Community> ) {}
    getCommunity(id: number): Community {
        return this.communityIndex.get(id)
    }
    getCommunityAt(path: CommunityName[]): Community {
        return getCommunity(path,this.analysisJson.community, this)
    }
    getWrittenFunctions():Function[] {
        return this.analysisJson["functions"].filter(this.isWritten)
    }
    getFunction(id:number):Function{
        return this.analysisJson.functions[id];
    }
    getCalls():Call[]{
        return this.analysisJson.calls
    }
    getMetric(subject: Function | Community, metric: Metric): number {
        if (metric in subject) {
            return subject[metric] as number
        } else {
            throw Error("This metric doesn't exist within this subject. Metric:" + metric+" subject: "+JSON.stringify(subject))
        }
    }
    getSubCommunities(c: Community): Community[] {
        if ("communities" in c) {
            return c.communities as Community[];
        } else {
            throw Error("Cannot get subcommunities of a community")
        }
    }
    getFunctionsInside(community: Community): number[] {
        if ("functions" in community) {
            return community["functions"] as number[]
        } else {
            throw Error("This community has no functions")
        }
    }
    getTreemapId(community: Community):number {
        if ("_treemap_id" in community) {
            return community["_treemap_id"] as number
        } else {
            throw Error("This community has no treemap id")
        }
    }
    isAbstract(community: Community): boolean {
        return (
            this.getSubCommunities(community).length == 0
            &&
            this.getFunctionsInside(community).every(
                f => !this.isWritten(this.analysisJson["functions"][f])
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
                    return !Number.isNaN(f[k])
                })
                .forEach(k => {
                    metricsDict[k] = true
                });
        });
        return Object.keys(metricsDict).filter(v => !['location', 'name', 'written'].includes(v))
    }
    addToMetric(community: Community, metric: Metric, value: number): number {
        let gotMetric = 0
        try {
            gotMetric = this.getMetric(community, metric)
        } catch (_) { }
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
                    this.addToMetric(community, m, this.getMetric(childCommunity, m))
                )
            )
    
        this.getFunctionsInside(community)
            .map(id => this.analysisJson.functions[id])
            .forEach(func => metrics.forEach(metric =>
                this.addToMetric(community, metric, this.getMetric(func, metric))
            ))
    }
}