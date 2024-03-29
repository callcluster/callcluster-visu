import Visualization from "./Visualization";
import { makeHistogram, isHistogram } from "./histogram";
import { isTreemap, makeTreemap } from "./treemap";
import {isHierarchical, makeHierarchicalGraph, isDiff} from "./hierarchicalGraph";
import Analyzable from "./_Analyzable";
export default function makeVisualization(visualization: Visualization, analyzable:Analyzable) {
    console.log("STARTING VISUALIZATION")
    console.log(visualization)
    if (isTreemap(visualization)) {
        return {
            subjects: makeTreemap(visualization, analyzable, visualization?.coloringParameters?.leftColorer ?? null),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            root: visualization.root,
            parents:(
                (visualization.root == undefined)
                ?undefined
                :analyzable.getParents(visualization.root)
            ),
            coloringParameters:visualization?.coloringParameters
        };
    } else if (isHistogram(visualization)) {
        return {
            bars: makeHistogram(visualization, analyzable),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
        }
    } else if (isHierarchical(visualization)) {
        return {
            ...(makeHierarchicalGraph(visualization, analyzable, visualization?.coloringParameters?.leftColorer ?? null)),
            root: visualization.root,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
            parents:(
                (visualization.root == undefined)
                ?undefined
                :analyzable.getParents(visualization.root)
            ),
            coloringParameters:visualization?.coloringParameters
        }
    } else if (isDiff(visualization)) {
        return {
            left:makeHierarchicalGraph(visualization, analyzable, visualization?.coloringParameters?.leftColorer ?? null),
            right:makeHierarchicalGraph(visualization, analyzable, visualization?.coloringParameters?.rightColorer ?? null),
            root: visualization.root,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
            parents:(
                (visualization.root == undefined)
                ?undefined
                :analyzable.getParents(visualization.root)
            ),
            coloringParameters:visualization?.coloringParameters
        }
    }
}