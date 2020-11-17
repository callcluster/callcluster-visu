import Visualization from "../Visualization";
import TreemapVisualization from "./TreemapVisualization";
export default function isTrreemap(visu: Visualization): visu is TreemapVisualization {
    return visu.visualizationType === "treemap"
}