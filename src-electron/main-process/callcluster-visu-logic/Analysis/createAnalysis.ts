import Analysis from "./Analysis";
import Analyzable from "./_Analyzable";
import CommunityInterpreter from "./_CommunityInterpreter";
import CommunityRepository from "./_CommunityRepository";
import { Community, Callgraph } from "./_types";

export default function createAnalysis(
    callgraph:Callgraph,
    interpreter:CommunityInterpreter,
    repository:CommunityRepository
):Analyzable {
    return new Analysis(callgraph, interpreter, repository)
}