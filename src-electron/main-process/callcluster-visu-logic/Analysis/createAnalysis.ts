import Analysis from "./Analysis";
import Analyzable from "./_Analyzable";
import CommunityInterpreter from "./_CommunityInterpreter";
import CommunityMeasurer from "./_CommunityMeasurer";
import CommunityRepository from "./_CommunityRepository";
import { Community, Callgraph } from "./_types";
import FunctionLocator from "./_FunctionLocator";
export default function createAnalysis(
    callgraph:Callgraph,
    interpreter:CommunityInterpreter,
    repository:CommunityRepository,
    measurer:CommunityMeasurer,
    functionLocator:FunctionLocator
):Analyzable {
    return new Analysis(callgraph, interpreter, repository, measurer, functionLocator)
}