import HierarchicalVisualization from "./HierarchicalVisualization";
import makeEvaluator from "./_makeEvaluator";
import getNodesInsideCommunity from "./getNodesInsideCommunity";
import Node from "./Node";
import Analyzable from "./_Analyzable";
import { CommunityIdentifier } from "./_types";
import Colorer from "./_Colorer";
import DiffVisualization from "./DiffVisualization";

export default function makeHierarchicalGraph(visualization:HierarchicalVisualization|DiffVisualization, analyzable:Analyzable, colorer:Colorer|null){
    const community = analyzable.getCommunityFromString(visualization.root)
    const evaluator = makeEvaluator(visualization, analyzable)
    const openedCommunities=(visualization.openedCommunities??[]).map(id=>new CommunityIdentifier(id))

    const nodes:Node[] = [
        ...getNodesInsideCommunity(community, openedCommunities ?? [], evaluator, analyzable, colorer),
        ...(openedCommunities || [])
            .map((id) => analyzable.getCommunityFromString(id))
            .map((community) => getNodesInsideCommunity(community, openedCommunities ?? [], evaluator, analyzable, colorer))
            .reduce((a, b) => [...a, ...b], [])
    ]

    const nodeIdDict: Record<number, CommunityIdentifier> = {}
    const allFunctions = new Set()
    nodes.forEach(node => {
        node.functions.forEach((fid) => {
            nodeIdDict[fid as unknown as number] = node.id
            allFunctions.add(fid)
        })
    });

    return {
        nodes: nodes.map(v => ({
            ...v,
            functions: undefined,
            label: v.name,
        })),
        edges: [...new Set([
            ...analyzable.getCalls(community)
                .filter(({ from, to }) => from !== to)
                .filter(({ from }) => allFunctions.has(from))
                .filter(({ to }) => allFunctions.has(to))
                .map(({ from, to }) => ({
                    from: nodeIdDict[from as unknown as number],
                    to: nodeIdDict[to as unknown as number],
                    arrows: "to"
                }))
                .filter(({ from, to }) => from !== to)
                .map((v) => JSON.stringify(v))
        ])].map((s) => JSON.parse(s))
    }
}

