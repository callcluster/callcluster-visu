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
        Object.keys(f)
        .filter( k => {
            return !Number.isNaN(Number.parseFloat(f[k]))
        })
        .forEach(k => {
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

function getSubjectForFunction(id){
    return {
        ...analysisJson.functions[id],
        type: 'function',
        id:`f${id}`
    }
}

function getSubjectsFor(visualization){
    const metric = visualization.parameters.metric;
    let community = getCommunity(visualization.path || [], analysisJson.community);
    const subjects = [
        ...( community.functions || [] )
        .map(getSubjectForFunction),
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
    } else if(visualization.visualizationType=='histogram') {
        return {
            bars: getBarsFor(visualization.parameters),
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
        }
    } else if(visualization.visualizationType=='hierarchical') {
        return {
            ...(getNodesAndEdgesFor(visualization.parameters,visualization.path,visualization.openedCommunities)),
            path: visualization.path,
            visualizationType: visualization.visualizationType,
            id: visualization.id,
            parameters: visualization.parameters,
            openedCommunities: visualization.openedCommunities || [],
        }
    }
}

function getAllFunctions (community) {
    return [
        ...community.functions,
        ...(
            community.communities
            .map(getAllFunctions)
            .reduce((a,b)=>[...a, ...b],[])
        )
    ]
}
function getColor(seed){
    return "#"+Math.floor((Math.abs(Math.sin(seed+1000) * 16777215)) % 16777215).toString(16);
}
function getNodesForCommunity(community, excludedIds){
    return [
        ...(community.functions || [])
        .map( id => ({ 
            ...getSubjectForFunction(id), 
            functions: new Set([id])}) ,
        ),
        ...(community.communities || [])
        .filter((c)=>!(excludedIds || []).includes("c"+c._treemap_id))
        .map( c =>{
            let ret  = { ...c }
            let totalFunctions =  getAllFunctions(c)
            delete ret.communities
            delete ret.functions
            delete ret.id
            return {
                ...ret,
                
                id: `c${c._treemap_id}`,
                functions: new Set(totalFunctions)
            }
        }),
    ].map(n =>({
        ...n,
        parent: `c${community._treemap_id}`,
        color:getColor(community._treemap_id)
    }))

}

function getNodesAndEdgesFor(parameters, path, openedCommunities){
    const community = getCommunity(path || [], analysisJson.community);
    const {scaling, metric} = parameters

    const nodes = [
        ...getNodesForCommunity(community, openedCommunities),
        ...(openedCommunities || [])
        .map((id)=>communityIndex.get(id.replace("c","")))
        .map((community)=>getNodesForCommunity(community,openedCommunities))
        .reduce((a,b)=>[...a,...b],[])
    ]

    const nodeIdDict={}
    const allFunctions = new Set()
    nodes.forEach(node => {
        node.functions.forEach((fid)=>{
            nodeIdDict[fid]=node.id
            allFunctions.add(Number.parseInt(fid))
        })
    });

    return {
        nodes: nodes.map(v => {
            let ret = {...v}
            delete ret.functions
            ret.label = ret.name
            ret.value = scale(scaling, ret[metric])
            return ret
        }),
        edges: [ ...new Set([ 
            ...analysisJson.calls
            .filter( ({from,to}) => from !== to )
            .filter( ({from,_}) => allFunctions.has(from))
            .filter( ({_,to}) => allFunctions.has(to))
            .map(({from,to})=>({
                from:nodeIdDict[""+from],
                to:nodeIdDict[""+to],
                arrows:"to"
            }))
            .filter(({from,to})=>from !== to)
            .map(JSON.stringify)
        ])].map(JSON.parse)
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
        return { ...analysisJson["functions"][(data.id+"").replace("f","")], type: 'function' }
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
