import Analysis from "./Analysis";
import makeVisualization from "./makeVisualization";
import Visualization from "./makeVisualization/Visualization";
export default function concreteMakeVisualization(visualization: Visualization) {
    return makeVisualization(visualization, new Analysis())
}