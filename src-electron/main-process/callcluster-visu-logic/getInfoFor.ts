import Analysis from "./Analysis";
import Analyzable from "./Analyzable";
interface InfoQuery {
    type:string
}

interface InfoQueryFunction extends InfoQuery {
    type:'function',
    id:string|number,
}
function isFunctionQuery(query: InfoQuery): query is InfoQueryFunction {
    return query.type === "function"
}

interface InfoQueryCommunity extends InfoQuery {
    _treemap_id:number,
}
function isCommunityQuery(query: InfoQuery): query is InfoQueryCommunity {
    return query.type !== "function"
}

function getInfoFor(data:InfoQuery, analyzable:Analyzable):Record<string,string|number> {
    if (isFunctionQuery(data)) {
        const fid = parseInt((data.id + "").replace("f", ""));
        return { ...analyzable.getFunction(fid), type: 'function' }
    } else if(isCommunityQuery(data)) {
        let info = { ...analyzable.getCommunity(data._treemap_id) }
        delete info.functions
        delete info.communities
        return {
            ...info,
            type: (info['type'] as string) || 'community'
        }
    } else {
        throw new Error("The query has no type "+JSON.stringify(data))
    }
}

function concreteGetInfoFor(data:InfoQuery){
    return getInfoFor(data, new Analysis())
}

export { concreteGetInfoFor as getInfoFor }