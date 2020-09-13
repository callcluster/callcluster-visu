import Index from "./Indexer"
import { getTreemap } from 'treemap-squarify';

let analysisJson={};

function prepareCommunityForTreemap(community,metrics,index){
    community._treemap_id=index.nextId;
    index.add(community);
    community.communities.forEach(c=>prepareCommunityForTreemap(c,metrics,index))
    metrics.forEach(m=>community[m]=0);
    community.communities.forEach(c => metrics.forEach(m => community[m] += c[m] ) )
    community.functions
        .map(id=>analysisJson.functions[id])
        .forEach(f => metrics.forEach(m => community[m] += f[m] ) )
}
function prepareAnalysisForTreemap(){
    let metrics = getAvailableMetrics();
    let communityIndex = new Index();
    prepareCommunityForTreemap(analysisJson.community,metrics,communityIndex)
}
function setAnalysisJson(localAnalysisJson){
    analysisJson=localAnalysisJson;
    prepareAnalysisForTreemap();
}
function getAvailableMetrics(){
    let metricsDict={}
    analysisJson['functions'].forEach(f => {
        Object.keys(f).forEach(k => {
            metricsDict[k]=true
        });
    });
    return Object.keys(metricsDict).filter(v=>!['location','name'].includes(v))
}

function getCommunity(path, community){
    if(path.length==0){
        return community;
    }else{
        let communityName = path[0]
        let possibleNextCommunities = community.communities.filter(c => c.name == communityName)
        if(possibleNextCommunities.length==0){
            return community;
        }else{
            return getCommunity(path.slice(1),possibleNextCommunities[0])
        }
    }
}

function getSubjectsFor(visualization){
    const metric = visualization.parameters.metric;
    let community = getCommunity(visualization.path || [], analysisJson.community);
    const subjects = [
        ...community.functions.map(id=>analysisJson.functions[id]), 
        ...community.communities
    ]
    .map(f=>({ name: f["name"], value: f[metric] }))
    .filter(f=>f.value!=0)
    .sort( (a,b) => a.value - b.value )

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}

function makeVisualization(visualization){
    console.log(visualization);
    return {
        subjects: getSubjectsFor(visualization),
        visualizationType: visualization.visualizationType,
        id: visualization.id,
        parameters: visualization.parameters,
        path: visualization.path
    };
}

export { setAnalysisJson, getAvailableMetrics, makeVisualization };
