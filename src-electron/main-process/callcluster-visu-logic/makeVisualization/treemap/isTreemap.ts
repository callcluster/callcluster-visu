import Visualization from "../../Visualization";
import TreemapVisualization from "./TreemapVisualization";
export default function isTreemap(visu: Visualization): visu is TreemapVisualization {
    return visu.visualizationType === "treemap"
}