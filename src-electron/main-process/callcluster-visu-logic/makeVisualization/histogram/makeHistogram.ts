import HistogramVisualization from "./HistogramVisualization";
import Analyzable from "./_Analyzable";
import makeEvaluator, { SubjectEvaluator } from "./_makeEvaluator";
import {Function} from './_types'

function calculateBins(limits:{min:number,max:number},preferredBins:number|undefined):{binSize:number,bins:number} {
    if(preferredBins===undefined){
        preferredBins=100
    }
    const {min,max}=limits
    const idealBinSize = (max - min) / preferredBins
    const binSize = [1,2,5,10,50,100].find(s => s>idealBinSize) ?? idealBinSize
    return {
        binSize,
        bins:Math.ceil(Math.ceil(max - min)/binSize)
    }
}

function getLimits(functions: Function[], evaluate: SubjectEvaluator):{min:number,max:number}{
    let min = Infinity
    let max = -Infinity
    for (const func of functions) {
        const val = evaluate(func)
        if (val!==undefined && val>0) {
            min = Math.min(val, min)
            max = Math.max(val, max)
        }
    }
    return {min, max}
}
export default function makeHistogram(visualization:HistogramVisualization, analyzable:Analyzable) {
    const evaluate = makeEvaluator(visualization, analyzable)
    const {min, max} = getLimits(analyzable.getWrittenFunctions(), evaluate)

    const {binSize,bins} = calculateBins({min,max},visualization.parameters.bins)
    const histogram = new Array(bins).fill(0).map((v, i) => ({
        y: 0,
        min: (min + binSize * i - 1),
        max: (min + binSize * (i + 1) - 1)
    }))
    for (const func of analyzable.getWrittenFunctions()) {
        const x = evaluate(func)
        if( x === undefined || x <= 0){
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
