import Visualization from "../Visualization";
import DiffVisualization from "./DiffVisualization";
export default function isDiff(visu: Visualization): visu is DiffVisualization {
    return visu.visualizationType === "diff"
}