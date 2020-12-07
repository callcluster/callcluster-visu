import Analysis from "./Analysis";
import Analyzable from "./_Analyzable";
import { Community, Callgraph } from "./_types";

export default function createAnalysis(minedCommunity:Community, callgraph:Callgraph):Analyzable{
    return new Analysis(minedCommunity, callgraph)
}