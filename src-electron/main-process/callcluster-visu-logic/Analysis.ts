import { Call, Community, Function } from "./types";
import Analyzable from "./Analyzable";
import { CommunityName } from "./CommunityName";
import getCommunity from "./getCommunity";
import { analysisJson, communityIndex } from "./globals";
import isWritten from "./isWritten";

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
}