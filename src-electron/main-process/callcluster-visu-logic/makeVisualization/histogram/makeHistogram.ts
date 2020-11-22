import scale from "../../scale";
import getMetric from "../../getMetric";
import HistogramVisualization from "./HistogramVisualization";
import Analyzable from "./_Analyzable";
export default function makeHistogram({parameters}:HistogramVisualization, analyzable:Analyzable) {
    let { metric, bins = 100, scaling = 'linear' } = parameters;

    let min = Infinity
    let max = -Infinity
    for (const func of analyzable.getWrittenFunctions()) {
        const val = scale(scaling, getMetric(func,metric))
        if (!isNaN(val) && val < 100000) {
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
        const x = scale(scaling, getMetric(func,metric))
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
