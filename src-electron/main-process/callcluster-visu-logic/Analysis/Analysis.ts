import { Metric, CommunityName, Call, Community, Function } from "./_types";
import Analyzable from "../Analyzable";
import getCommunity from "./getCommunity";
import { analysisJson, communityIndex } from "../globals";
import isWritten from "../isWritten";

export default class Analysis implements Analyzable {
    getCommunity(id: number): Community {
        return communityIndex.get(id)
    }
    getCommunityAt(path: CommunityName[]): Community {
        return getCommunity(path,analysisJson.community)
    }
    getWrittenFunctions():Function[] {
        return analysisJson["functions"].filter(isWritten)
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
}