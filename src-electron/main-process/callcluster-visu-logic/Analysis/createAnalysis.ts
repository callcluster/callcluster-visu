import Analysis from "./Analysis";
import Analyzable from "./_Analyzable";
import CommunityInterpreter from "./_CommunityInterpreter";
import { Community, Callgraph } from "./_types";

export default function createAnalysis(
    minedCommunity:Community,
    callgraph:Callgraph,
    interpreter:CommunityInterpreter
):Analyzable {
    return new Analysis(minedCommunity, callgraph, interpreter)
}