import { Call, Community, Function } from "./types";
import { CommunityName } from "./CommunityName"
export default interface Analyzable {
    getCommunity(id: number):Community;
    getCommunityAt(path:CommunityName[]):Community
    getWrittenFunctions():Function[]
    getFunction(id:number):Function
    getCalls():Call[]
}