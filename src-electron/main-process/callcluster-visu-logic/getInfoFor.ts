import { analysisJson, communityIndex } from "./globals"
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


function getInfoFor(data:InfoQuery):Record<string,string|number> {
    if (isFunctionQuery(data)) {
        const fid = parseInt((data.id + "").replace("f", ""));
        return { ...analysisJson["functions"][fid], type: 'function' }
    } else if(isCommunityQuery(data)) {
        let info = { ...communityIndex.get(data._treemap_id) }
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

export { getInfoFor }