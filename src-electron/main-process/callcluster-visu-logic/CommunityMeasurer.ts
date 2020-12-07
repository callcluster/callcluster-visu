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
        return Object.keys(metricsDict).filter(v => !['location', 'name', 'written'].includes(v))
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
        const definedMetrics=metrics??this.getAvailableMetrics()

        this.communityInterpreter.getSubCommunities(community)
            .forEach(childCommunity => 
                this.optimize(childCommunity, metrics)
            )
    
        this.communityInterpreter.getSubCommunities(community)
            .forEach(childCommunity => 
                definedMetrics.forEach(m => 
                    this.addToMetric(community, m, this.getMetric(childCommunity, m) ?? 0)
                )
            )
    
        this.communityInterpreter.getFunctionsInside(community)
            .map(id => this.getFunction(id))
            .forEach(func => definedMetrics.forEach(metric =>
                this.addToMetric(community, metric, this.getMetric(func, metric) ?? 0)
            ))
    }
}

export function createCommunityMeasurer(functions:Function[], interpreter:CommunityInterpreter):OptimizingCommunityMeasurer{
    return new ConcreteCommunityMeasurer(functions, interpreter)
}