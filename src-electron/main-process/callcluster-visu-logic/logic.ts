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

    analysis.getSubCommunities(community)
        .forEach(childCommunity => 
            prepareCommunityForTreemap(childCommunity, metrics, index, analysis)
        )

    analysis.getSubCommunities(community)
        .forEach(childCommunity => 
            metrics.forEach(m => 
                addToMetric(community, m, analysis.getMetric(childCommunity, m), analysis)
            )
        )

    analysis.getFunctionsInside(community)
        .map(id => analysisJson.functions[id])
        .forEach(func => metrics.forEach(metric =>
            addToMetric(community, metric, analysis.getMetric(func, metric), analysis)
        ))
}

function setAnalysisJson(localAnalysisJson: any) {
    setAnalysisJsonGlobalVariable(localAnalysisJson);
    let analysis = new Analysis(analysisJson,communityIndex)
    let metrics = analysis.getAvailableMetrics()
    prepareCommunityForTreemap(analysisJson.community, metrics, communityIndex, analysis)
}

export { setAnalysisJson };
