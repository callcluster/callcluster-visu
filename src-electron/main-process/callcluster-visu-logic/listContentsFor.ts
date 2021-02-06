import Analyzable from "./Analyzable"
import { Colorer, Visualization } from "./makeVisualization";
import getNodesInsideCommunity from "./makeVisualization/hierarchicalGraph/getNodesInsideCommunity";
import makeEvaluator from "./makeVisualization/makeEvaluator";
export interface ContentsQuery{
    node:string,
    coloringParameters:{
        leftColorer:Colorer|null, 
        rightColorer:Colorer|null
    },
    parameters:{
        community:{
            label:string,
            value:number
        },
        metric:string,
        scaling:string
    }
}
export default function listContentsFor(query:ContentsQuery,analyzable:Analyzable):any{
    let community = analyzable.getCommunityFromString(query.node)
    const evaluator = makeEvaluator({parameters:query.parameters} as Visualization, analyzable)
    return {
        left:getNodesInsideCommunity(community,[],evaluator,analyzable,query.coloringParameters.leftColorer),
        right:getNodesInsideCommunity(community,[],evaluator,analyzable,query.coloringParameters.rightColorer)
    }
}