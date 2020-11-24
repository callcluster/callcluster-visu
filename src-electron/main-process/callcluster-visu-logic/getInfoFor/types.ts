export interface InfoQuery {
    type:string
}

export interface InfoQueryFunction extends InfoQuery {
    type:'function',
    id:string|number,
}

export function isFunctionQuery(query: InfoQuery): query is InfoQueryFunction {
    return query.type === "function"
}

export interface InfoQueryCommunity extends InfoQuery {
    _treemap_id:number,
}

export function isCommunityQuery(query: InfoQuery): query is InfoQueryCommunity {
    return query.type !== "function"
}