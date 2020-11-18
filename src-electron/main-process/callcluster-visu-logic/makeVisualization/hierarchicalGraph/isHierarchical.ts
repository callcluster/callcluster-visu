import Visualization from "../../Visualization";
import HierarchicalVisualization from "./HierarchicalVisualization";
export default function isHierarchical(visu: Visualization): visu is HierarchicalVisualization {
    return visu.visualizationType === "hierarchical"
}