import Analysis from "./Analysis";
import { analysisJson, communityIndex } from "./globals";
import makeVisualization from "./makeVisualization";
import Visualization from "./makeVisualization/Visualization";
export default function concreteMakeVisualization(visualization: Visualization) {
    return makeVisualization(visualization, new Analysis(analysisJson, communityIndex))
}