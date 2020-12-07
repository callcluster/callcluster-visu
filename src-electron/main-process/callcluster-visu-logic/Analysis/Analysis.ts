import {
    Metric,
    CommunityName,
    Call,
    Community,
    Function,
    OriginalAnalysisJson,
    FunctionId,
    CommunityId,
    Callgraph
} from "./_types";
import Analyzable from "./_Analyzable";
import CommunityInterpreter from "./_CommunityInterpreter";
import CommunityRepository from "./_CommunityRepository";
import { CommunityIdentifier } from "../types";

export default class Analysis implements Analyzable {
    
    constructor(
        private callgraph:Callgraph, 
        private communityInterpreter:CommunityInterpreter,
        private communityRepository:CommunityRepository
    ) {}
    
    getParents(root: string): { id: string; name: string; }[] {
        const community = this.getCommunityFromString(root)
        let parent:Community|null=this.getParent(community);
        let parents:Community[] =[]
        while(parent!=null){
            parents=[parent,...parents]
            parent = this.getParent(parent);
        }
        return [...parents,community].map(community=>({
            id:this.getStringIdentifier(community),
            name:community.name as string
        }))
    }
    getAllFunctionsInside(community: Community): FunctionId[] {
        return [
            ...this.getFunctionsInside(community),
            ...(
                this.getSubCommunities(community)
                    .map((community)=>this.getAllFunctionsInside(community))
                    .reduce((a, b) => [...a, ...b], [])
            )
        ]
    }
    getParent(community: Community): Community | null {
        return this.communityRepository.getParent(community)
    }
    getMinedCommunity(): Community {
        return this.communityRepository.getMinedCommunity()
    }
    getColor(community: Community): string {
        const seed = community["_treemap_id"] as number
        return "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
    }
    getFunctionId(id: string):FunctionId {
        return parseInt(id.replace("f","")) as unknown as FunctionId
    }
    getCommunityFromString(id: CommunityIdentifier):Community {
        return this.communityRepository.getCommunityFromString(id)
    }
    getCommunity(id: CommunityId): Community {
        return this.communityRepository.getCommunity(id)
    }
    getWrittenFunctions():Function[] {
        return this.callgraph.functions.filter(this.isWritten)
    }
    getFunction(id:FunctionId):Function{
        return this.callgraph.functions[id as unknown  as number];
    }
    getCalls(community:Community):Call[]{
        const allFunctions = new Set(this.getAllFunctionsInside(community))
        return this.callgraph.calls
            .filter(({ from, to }) => from!==to && allFunctions.has(from) && allFunctions.has(to))
    }
    getMetric(subject: Function | Community, metric: Metric): number|undefined {
        if (metric in subject) {
            return subject[metric] as number
        } else {
            return undefined
        }
    }
    getSubCommunities(c: Community): Community[] {
        return this.communityInterpreter.getSubCommunities(c)
    }
    getFunctionsInside(community: Community): FunctionId[] {
        return this.communityInterpreter.getFunctionsInside(community)
    }
    getStringIdentifier(identifiable: Community|FunctionId):string {
        return this.communityInterpreter.getStringIdentifier(identifiable)
    }
    getNumberIdentifier(community:Community):number{
        return this.communityInterpreter.getNumberIdentifier(community)
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
        this.callgraph.functions.forEach(f => {
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


    private optimizeMetrics(community: Community, metrics: Metric[]) {

        this.getSubCommunities(community)
            .forEach(childCommunity => 
                this.optimizeMetrics(childCommunity, metrics)
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
    

    optimize(community: Community|null = null, metrics: Metric[]|null = null) {
        if(community==null){
            community=this.getMinedCommunity()
        }
        if(metrics==null){
            metrics = this.getAvailableMetrics()
        }
        this.optimizeMetrics(community, metrics)
    }
}