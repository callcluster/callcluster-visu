import { Call, Community, Function } from "./globals";
import Analyzable from "./Analyzable";
import { CommunityName } from "./CommunityName";
import getCommunity from "./getCommunity";
import { analysisJson } from "./globals";
import isWritten from "./isWritten";

export default class Analysis implements Analyzable {
    getCommunity(path: CommunityName[]): Community {
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
}