import Index from "./Indexer"
import { getTreemap } from 'treemap-squarify';

let analysisJson = {}
let communityIndex = new Index();

function prepareCommunityForTreemap (community, metrics, index) {
    community._treemap_id = index.nextId
    index.add(community)
    community.communities.forEach(c=>prepareCommunityForTreemap(c,metrics,index))
    metrics.forEach(m=>community[m]=0);
    community.communities.forEach(c => metrics.forEach(m => community[m] += c[m] ) )
    community.functions
        .map(id=>analysisJson.functions[id])
        .forEach(f => metrics.forEach(m => community[m] += f[m] ) )
}

function setAnalysisJson(localAnalysisJson){
    analysisJson=localAnalysisJson;
    let metrics = getAvailableMetrics();
    prepareCommunityForTreemap(analysisJson.community,metrics,communityIndex)
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
        ...( community.functions || [] )
            .map(id=>({ ...analysisJson.functions[id], id}))
            .map(f=>({ ...f, type:"function"})), 
        ...( community.communities || [] )
            .map(f=>{
                let fr = { ...f }
                delete fr.communities
                delete fr.functions
                return { ...fr, type: f.type || "community" }
            }), 
    ]
    .map(f=>({...f, value: scale(visualization.parameters.scaling, f[metric]) }))
    .filter(f=>f.value!=0)
    .sort( (a,b) => a.value - b.value )

    return getTreemap({
        data: subjects,
        width: 100,
        height: 100
    });
}

function makeVisualization(visualization){
    console.log(visualization)
    if(visualization.visualizationType=='treemap'){
        return {
            subjects: getSubjectsFor(visualization),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            path: visualization.path
        };
    } else {
        return {
            bars: getBarsFor(visualization.parameters),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
        }
    }
}

function scale(scaling,num) {
    if ( scaling === 'log10' ) {
        return Math.log10(num)
    } else if ( scaling === 'log2' ) {
        return Math.log2(num)
    }
    return num
}

function getBarsFor({community, metric, bins=100, scaling='linear'}){
    let min = Infinity
    let max = -Infinity
    for(const func of analysisJson["functions"]){
        const val = scale(scaling,func[metric])
        if(!isNaN(val) && val < 100000){
            min = Math.min(val, min)
            max = Math.max(val, max)
        }
    }
    let binSize = (max - min) / bins
    if(binSize<1){
        binSize = 1
        bins = Math.ceil(max - min)
    }
    const histogram = new Array(bins).fill(0).map((v,i)=>({
        y:0,
        min:(min + binSize * i),
        max:(min + binSize * (i + 1))
    }))
    for(const func of analysisJson["functions"]){
        const x = scale(scaling,func[metric])
        const bin = Math.floor((x-min)/binSize)
        const realBin = Math.min(bin, histogram.length - 1)
        if(histogram[realBin]){
            histogram[realBin].y += 1
        }else{
            console.log("Bin "+realBin+" doesn't exist!")
            console.log(min,max,binSize,bins)
        }
        
    }
    return histogram
}

function getInfoFor(data){
    if(data.type==='function'){
        return { ...analysisJson["functions"][data.id], type: 'function' }
    }else{
        let info = { ...communityIndex.get(data._treemap_id) }
        delete info.functions
        delete info.communities
        return { 
            ...info,
            type: info['type'] || 'community'
        }
    }
}

export { setAnalysisJson, getAvailableMetrics, makeVisualization, getInfoFor };
