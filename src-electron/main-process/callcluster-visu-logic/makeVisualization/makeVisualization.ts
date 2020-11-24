import Visualization from "./Visualization";
import { makeHistogram, isHistogram } from "./histogram";
import { isTreemap, makeTreemap } from "./treemap";
import {isHierarchical, makeHierarchicalGraph} from "./hierarchicalGraph";
import Analyzable from "./_Analyzable";
export default function makeVisualization(visualization: Visualization, analyzable:Analyzable) {
    console.log(visualization)
    if (isTreemap(visualization)) {
        return {
            subjects: makeTreemap(visualization, analyzable),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            path: visualization.path
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
            ...(makeHierarchicalGraph(visualization, analyzable)),
            path: visualization.path,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
        }
    }
}