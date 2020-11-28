import HistogramVisualization from "./HistogramVisualization";
import Analyzable from "./_Analyzable";
import makeEvaluator from "./_makeEvaluator";
export default function makeHistogram(visualization:HistogramVisualization, analyzable:Analyzable) {
    let { bins = 100 } = visualization.parameters;
    const evaluate = makeEvaluator(visualization, analyzable)

    let min = Infinity
    let max = -Infinity
    for (const func of analyzable.getWrittenFunctions()) {
        const val = evaluate(func)
        if (val!==undefined && val < 100000) {
            min = Math.min(val, min)
            max = Math.max(val, max)
        }
    }
    let binSize = (max - min) / bins
    if (binSize < 1) {
        binSize = 1
        bins = Math.ceil(max - min)
    }
    const histogram = new Array(bins).fill(0).map((v, i) => ({
        y: 0,
        min: (min + binSize * i),
        max: (min + binSize * (i + 1))
    }))
    for (const func of analyzable.getWrittenFunctions()) {
        const x = evaluate(func)
        if( x === undefined ){
            continue;
        }
        const bin = Math.floor((x - min) / binSize)
        const realBin = Math.min(bin, histogram.length - 1)
        if (histogram[realBin]) {
            histogram[realBin].y += 1
        } else {
            console.log("Bin " + realBin + " doesn't exist!")
            console.log(min, max, binSize, bins)
        }

    }
    return histogram
}
