import HierarchicalVisualization from "./HierarchicalVisualization";
import makeEvaluator from "./_makeEvaluator";
import getNodesInsideCommunity from "./getNodesInsideCommunity";
import Node from "./Node";
import Analyzable from "./_Analyzable";
export default function makeHierarchicalGraph(visualization:HierarchicalVisualization, analyzable:Analyzable){
    const {path, openedCommunities} = visualization
    const community = analyzable.getCommunityAt(path ?? [])
    const evaluator = makeEvaluator(visualization)

    const nodes:Node[] = [
        ...getNodesInsideCommunity(community, openedCommunities ?? [], evaluator, analyzable),
        ...(openedCommunities || [])
            .map((id) => analyzable.getCommunity(parseInt(id.replace("c", ""))))
            .map((community) => getNodesInsideCommunity(community, openedCommunities ?? [], evaluator, analyzable))
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
            ...analyzable.getCalls()
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

