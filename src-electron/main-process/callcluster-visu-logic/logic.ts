import Index from "./Indexer"

import { Metric, Function, Community, analysisJson, communityIndex, setAnalysisJsonGlobalVariable } from "./globals"
import getMetric from "./getMetric";
import { CommunityName } from "./CommunityName";
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

//------------------------------------------- GETSUBJECTSFOR (TREEMAP) ------------------------- //

import getSubjectsFor from "./treemap/getSubjectsFor";




// ----------------------------------- MAKEVISUALIZATION: MAIN ENTRY POINT -------------------//
import Visualization from "./Visualization";
import {makeHistogram, isHistogram} from "./histogram";
import TreemapVisualization from "./treemap/TreemapVisualization";
import isTrreemap from "./treemap/isTrreemap";


import {isHierarchical, makeHierarchicalGraph} from "./hierarchicalGraph";

function makeVisualization(visualization: Visualization) {
    console.log(visualization)
    if (isTrreemap(visualization)) {
        return {
            subjects: getSubjectsFor(visualization),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            path: visualization.path
        };
    } else if (isHistogram(visualization)) {
        return {
            bars: makeHistogram(visualization),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
        }
    } else if (isHierarchical(visualization)) {
        return {
            ...(makeHierarchicalGraph(visualization)),
            path: visualization.path,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
        }
    }
}


export { setAnalysisJson, getAvailableMetrics, makeVisualization };
