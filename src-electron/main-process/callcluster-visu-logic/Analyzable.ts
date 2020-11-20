import { Call, Community, Function } from "./globals";
import { CommunityName } from "./CommunityName"
export default interface Analyzable {
    getCommunity(path:CommunityName[]):Community
    getWrittenFunctions():Function[]
    getFunction(id:number):Function
    getCalls():Call[]
}