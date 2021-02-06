import CommunityInterpreter from "./Analysis/_CommunityInterpreter";
import { Community, Function, FunctionId, Metric } from "./types";
export default interface CommunityMeasurer{
    getAvailableMetrics(): Metric[]
    getMetric(subject: Function | Community, metric: Metric): number|undefined
}
export interface OptimizingCommunityMeasurer extends CommunityMeasurer{
    optimize(community: Community):void
}

class ConcreteCommunityMeasurer implements OptimizingCommunityMeasurer{
    constructor(private functions:Function[], private communityInterpreter:CommunityInterpreter){}
    getAvailableMetrics(): Metric[] {
        let metricsDict: Record<string, boolean> = {}
        this.functions.forEach(f => {
            Object.keys(f)
                .filter(k => {
                    return Number.isFinite(f[k])
                })
                .forEach(k => {
                    metricsDict[k] = true
                });
        });
        return Object.keys(metricsDict).filter(v => !['location', 'name', 'written'].includes(v)).concat(['descendants'])
    }
    getMetric(subject: Function | Community, metric: Metric): number|undefined {
        if (metric in subject) {
            return subject[metric] as number
        } else {
            return undefined
        }
    }
    addToMetric(community: Community, metric: Metric, value: number): number {
        const gotMetric = this.getMetric(community, metric) ?? 0
        const sum = gotMetric + value
        community[metric] = sum
        return sum
    }

    getFunction(id:FunctionId):Function{
        return this.functions[id as unknown  as number];
    }

    optimize(community: Community, metrics?: Metric[]) {
        const definedMetrics = (metrics??this.getAvailableMetrics()).filter(m=>m!=='descendants' && m!=='minlevel')
        const subcommunities = this.communityInterpreter.getSubCommunities(community)
        const functions = this.communityInterpreter.getFunctionsInside(community)

        
        subcommunities.forEach(childCommunity => 
            this.optimize(childCommunity, metrics)
        )
        
        subcommunities.forEach(childCommunity => 
            definedMetrics.forEach(m => 
                this.addToMetric(community, m, this.getMetric(childCommunity, m) ?? 0)
            )
        )
    
        functions.map(id => this.getFunction(id)).forEach(func => 
            definedMetrics.forEach(metric =>
                this.addToMetric(community, metric, this.getMetric(func, metric) ?? 0)
            )
        )

        // descendants count
        const indirectDescendants=subcommunities.map(childCommunity=>this.getMetric(childCommunity,'descendants') ?? 0).reduce((a,b)=>a+b,0)
        this.setMetric(community,'descendants',indirectDescendants+functions.length)

        //minimum level
        if(functions.length>0){
            this.setMetric(community,'minlevel',1)
        }else{
            const lowestMinLevel=subcommunities.map(childCommunity=>this.getMetric(childCommunity,'minlevel') ?? Infinity).reduce((a,b)=>Math.min(a,b),Infinity)
            this.setMetric(community,'minlevel',lowestMinLevel+1)
        }
    }
    setMetric(community: Community, metric: Metric, value: number): number {
        community[metric] = value
        return value
    }
}

export function createCommunityMeasurer(functions:Function[], interpreter:CommunityInterpreter):OptimizingCommunityMeasurer{
    return new ConcreteCommunityMeasurer(functions, interpreter)
}