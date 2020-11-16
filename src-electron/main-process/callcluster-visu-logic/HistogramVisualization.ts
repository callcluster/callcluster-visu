import Visualization from "./Visualization";
export default interface HistogramVisualization extends Visualization {
    visualizationType: 'histogram',
    parameters: {
        scaling: string,
        metric: string,
        bins:number
    }
}