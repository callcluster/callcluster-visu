import Index from "./Indexer"
import { getTreemap } from 'treemap-squarify';
import { Metric, Function, Community, analysisJson, communityIndex, setAnalysisJsonGlobalVariable } from "./globals"
import getMetric from "./getMetric";
// ----------------------------- GETTERS AND TYPE DEFINITIONS ----------------------------//
type CommunityName = string;


function getSubCommunities(c: Community): Community[] {
    if ("communities" in c) {
        return c.communities as Community[];
    } else {
        throw Error("Cannot get subcommunities of a community")
    }
}

function addToMetric(community: Community, metric: Metric, value: number): number {
    let gotMetric = 0
    try {
        gotMetric = getMetric(community, metric)
    } catch (_) { }
    const sum = gotMetric + value
    community[metric] = sum
    return sum
}
function getFunctions(community: Community): number[] {
    if ("functions" in community) {
        return community["functions"] as number[]
    } else {
        throw Error("This community has no functions")
    }
}
function getTreemapId(community: Community) {
    if ("_treemap_id" in community) {
        return community["_treemap_id"] as number
    } else {
        throw Error("This community has no treemap id")
    }
}

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

function getCommunity(path: CommunityName[], community: Community): Community {
    if (path.length == 0) {
        return community;
    } else {
        let communityName = path[0]
        let possibleNextCommunities = getSubCommunities(community).filter(c => c.name == communityName)
        if (possibleNextCommunities.length == 0) {
            return community;
        } else {
            return getCommunity(path.slice(1), possibleNextCommunities[0])
        }
    }
}

//------------------------------------------- GETSUBJECTSFOR (TREEMAP) ------------------------- //

function getSubjectForFunction(id: number, evaluator: SubjectEvaluator): PartialSubject {
    const func = analysisJson.functions[id];
    return {
        ...func,
        id: `f${id}`,
        type: 'function',
        value: evaluator(func),
        name: func.name
    }
}

function getSubjectForCommunity(community: Community, evaluator: SubjectEvaluator): PartialSubject {
    return {
        ...community,
        id: "c" + community._treemap_id,
        communities: undefined,
        functions: undefined,
        type: "community",
        value: evaluator(community),
        name: community.name
    }
}


interface SubjectFields {
    id: string
    type: string,
    value: number
}

type PartialSubject = Record<string, unknown> & SubjectFields

type SubjectEvaluator = (s: Function | Community) => number

import scale,{Scaling} from "./scale"

function makeEvaluator(scaling: Scaling, metric: Metric) {
    return (s: Function | Community) => {
        return scale(
            scaling,
            getMetric(s, metric)
        )
    }
}

function getSubjectsFor(visualization: HierarchicalVisualization|TreemapVisualization) {
    const community = getCommunity(visualization.path || [], analysisJson.community);
    const evaluator = makeEvaluator(
        visualization.parameters.scaling,
        visualization.parameters.metric
    )

    const subjects = [
        ...getFunctions(community)
            .map((fid) => getSubjectForFunction(fid, evaluator)),
        ...getSubCommunities(community)
            .map((c) => getSubjectForCommunity(c, evaluator)),
    ]
        .filter(f => f.value != 0)
        .sort((a, b) => a.value - b.value)

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}

// ----------------------------------- MAKEVISUALIZATION: MAIN ENTRY POINT -------------------//
import Visualization from "./Visualization";
import isHistogram from "./isHistogram";
import makeHistogram from "./makeHistogram";
interface TreemapVisualization extends Visualization {
    visualizationType: 'treemap',
    path: CommunityName[],
}

function isTrreemap(visu: Visualization): visu is TreemapVisualization {
    return visu.visualizationType === "treemap"
}


interface HierarchicalVisualization extends Visualization {
    visualizationType: 'hierarchical',
    path: CommunityName[],
    openedCommunities?: string[],
}

function isHierarchical(visu: Visualization): visu is HierarchicalVisualization {
    return visu.visualizationType === "hierarchical"
}

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
            ...(getNodesAndEdgesFor(visualization)),
            path: visualization.path,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
        }
    }
}

// ---------------------------------- HIERARCHICAL GRAPH ------------------------------ //

function getAllFunctions(community: Community): number[] {
    return [
        ...getFunctions(community),
        ...(
            getSubCommunities(community)
                .map(getAllFunctions)
                .reduce((a, b) => [...a, ...b], [])
        )
    ]
}
function getColor(seed: number): string {
    return "#" + Math.floor((Math.abs(Math.sin(seed + 1000) * 16777215)) % 16777215).toString(16);
}
import isWritten from "./isWritten"
function isAbstract(community: Community): boolean {
    return getSubCommunities(community).length == 0 && getFunctions(community).every(f => !isWritten(analysisJson["functions"][f]))
}

function getNodesForCommunity(community: Community, excludedIds: CommunityIdentifier[], evaluator: SubjectEvaluator) {
    return [
        ...getFunctions(community)
            .filter(fid => isWritten(analysisJson.functions[fid]))
            .map(id => {
                const subject = getSubjectForFunction(id, evaluator);
                return ({
                    ...subject,
                    functions: new Set([id]),
                    name: subject.name
                })

            }),
        ...getSubCommunities(community)
            .filter((c) => !excludedIds.includes("c" + getTreemapId(c)))
            .filter(c => !isAbstract(c))
            .map(c => {
                let ret = { ...c }
                let totalFunctions = getAllFunctions(c)
                delete ret.communities
                delete ret.functions
                delete ret.id
                return {
                    ...ret,
                    value: evaluator(c),
                    id: `c${getTreemapId(c)}`,
                    functions: new Set(totalFunctions),
                    name: ret.name
                }
            }),
    ].map(n => ({
        ...n,
        parent: `c${getTreemapId(community)}`,
        color: getColor(getTreemapId(community))
    }))

}
type CommunityIdentifier = string
function getNodesAndEdgesFor(visualization:HierarchicalVisualization){
    const {parameters, path, openedCommunities} = visualization
    const community = getCommunity(path || [], analysisJson.community);
    const evaluator = makeEvaluator(parameters.scaling, parameters.metric)

    const nodes = [
        ...getNodesForCommunity(community, openedCommunities ?? [], evaluator),
        ...(openedCommunities || [])
            .map((id) => communityIndex.get(parseInt(id.replace("c", ""))))
            .map((community) => getNodesForCommunity(community, openedCommunities ?? [], evaluator))
            .reduce((a, b) => [...a, ...b], [])
    ]

    const nodeIdDict: Record<number, string> = {}
    const allFunctions = new Set()
    nodes.forEach(node => {
        node.functions.forEach((fid) => {
            nodeIdDict[fid] = node.id
            allFunctions.add(fid)
        })
    });

    return {
        nodes: nodes.map(v => ({
            ...v,
            functions: undefined,
            label: v.name
        })),
        edges: [...new Set([
            ...analysisJson.calls
                .filter(({ from, to }) => from !== to)
                .filter(({ from }) => allFunctions.has(from))
                .filter(({ to }) => allFunctions.has(to))
                .map(({ from, to }) => ({
                    from: nodeIdDict[from],
                    to: nodeIdDict[to],
                    arrows: "to"
                }))
                .filter(({ from, to }) => from !== to)
                .map((v) => JSON.stringify(v))
        ])].map((s) => JSON.parse(s))
    }
}




export { setAnalysisJson, getAvailableMetrics, makeVisualization };
