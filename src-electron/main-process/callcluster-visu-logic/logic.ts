import Index from "./Indexer"
import { Metric, Community, analysisJson, communityIndex, setAnalysisJsonGlobalVariable } from "./globals"
import getMetric from "./getMetric";
import getSubCommunities from "./getSubCommunities";

// ----------------------------- GETTERS AND TYPE DEFINITIONS ----------------------------//

function addToMetric(community: Community, metric: Metric, value: number): number {
    let gotMetric = 0
    try {
        gotMetric = getMetric(community, metric)
    } catch (_) { }
    const sum = gotMetric + value
    community[metric] = sum
    return sum
}
import getFunctions from "./getFunctions";


// ----------------------------------------- SETTERS -------------------------------------- //
function prepareCommunityForTreemap(community: Community, metrics: Metric[], index: Index<Community>) {
    community._treemap_id = index.nextId
    index.add(community)
    getSubCommunities(community).forEach(c => prepareCommunityForTreemap(c, metrics, index))
    getSubCommunities(community).forEach(childCommunity => metrics.forEach(m => addToMetric(community, m, getMetric(childCommunity, m))))
    getFunctions(community)
        .map(id => analysisJson.functions[id])
        .forEach(func => metrics.forEach(metric =>
            addToMetric(community, metric, getMetric(func, metric))
        ))
}

function setAnalysisJson(localAnalysisJson: any) {
    setAnalysisJsonGlobalVariable(localAnalysisJson);
    let metrics = getAvailableMetrics();
    prepareCommunityForTreemap(analysisJson.community, metrics, communityIndex)
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
