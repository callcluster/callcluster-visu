import { Metric, CommunityName, Call, Community, Function } from "./_types";
import Analyzable from "../Analyzable";
import getCommunity from "./getCommunity";
import { analysisJson, communityIndex } from "../globals";

export default class Analysis implements Analyzable {
    getCommunity(id: number): Community {
        return communityIndex.get(id)
    }
    getCommunityAt(path: CommunityName[]): Community {
        return getCommunity(path,analysisJson.community, this)
    }
    getWrittenFunctions():Function[] {
        return analysisJson["functions"].filter(this.isWritten)
    }
    getFunction(id:number):Function{
        return analysisJson.functions[id];
    }
    getCalls():Call[]{
        return analysisJson.calls
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
                f => !this.isWritten(analysisJson["functions"][f])
            )
        )
    }
    isWritten(func: Function): boolean {
        return func.written == undefined || func.written == true;
    }
}