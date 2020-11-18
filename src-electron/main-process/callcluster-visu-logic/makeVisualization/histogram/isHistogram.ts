import Visualization from "../../Visualization";
import HistogramVisualization from "./HistogramVisualization";
export default function isHistogram(visu: Visualization): visu is HistogramVisualization {
    return visu.visualizationType === "histogram"
}