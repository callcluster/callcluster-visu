import Index from "./Indexer"
import { Metric, Community } from "./types"
import {analysisJson, communityIndex, setAnalysisJsonGlobalVariable} from "./globals"

// ----------------------------- GETTERS AND TYPE DEFINITIONS ----------------------------//

function addToMetric(community: Community, metric: Metric, value: number, analysis:Analyzable): number {
    let gotMetric = 0
    try {
        gotMetric = analysis.getMetric(community, metric)
    } catch (_) { }
    const sum = gotMetric + value
    community[metric] = sum
    return sum
}
import Analysis from "./Analysis";
import Analyzable from "./makeVisualization/_Analyzable";


// ----------------------------------------- SETTERS -------------------------------------- //
function prepareCommunityForTreemap(community: Community, metrics: Metric[], index: Index<Community>, analysis:Analyzable) {
    community._treemap_id = index.nextId
    index.add(community)
    analysis.getSubCommunities(community).forEach(c => prepareCommunityForTreemap(c, metrics, index, analysis))
    analysis.getSubCommunities(community).forEach(childCommunity => metrics.forEach(m => addToMetric(community, m, analysis.getMetric(childCommunity, m), analysis)))
    analysis.getFunctionsInside(community)
        .map(id => analysisJson.functions[id])
        .forEach(func => metrics.forEach(metric =>
            addToMetric(community, metric, analysis.getMetric(func, metric), analysis)
        ))
}

function setAnalysisJson(localAnalysisJson: any) {
    setAnalysisJsonGlobalVariable(localAnalysisJson);
    let metrics = getAvailableMetrics();
    let analysis = new Analysis(analysisJson,communityIndex)
    prepareCommunityForTreemap(analysisJson.community, metrics, communityIndex, analysis)
}

// ------------------------------------------- COMPLEX QUERIES --------------------------//
function getAvailableMetrics(): Metric[] {
    let metricsDict: Record<string, boolean> = {}

    analysisJson.functions.forEach(f => {
        Object.keys(f)
            .filter(k => {
                return !Number.isNaN(f[k])
            })
            .forEach(k => {
                metricsDict[k] = true
            });
    });
    return Object.keys(metricsDict).filter(v => !['location', 'name', 'written'].includes(v))
}

// ----------------------------------- MAKEVISUALIZATION: MAIN ENTRY POINT -------------------//



export { setAnalysisJson, getAvailableMetrics };
