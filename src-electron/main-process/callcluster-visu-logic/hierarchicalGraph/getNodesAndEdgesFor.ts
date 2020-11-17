import { analysisJson, communityIndex } from "../globals";
import HierarchicalVisualization from "./HierarchicalVisualization";
import getCommunity from "../getCommunity";
import makeEvaluator from "../makeEvaluator";
import getNodesForCommunity from "./getNodesForCommunity";
export default function getNodesAndEdgesFor(visualization:HierarchicalVisualization){
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

