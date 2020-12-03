export type InfoQuery=TypedQuery|AlternateQuery

export interface TypedQuery {
    type:string
}
export interface AlternateQuery {
    id:string
}

export interface InfoQueryFunction extends TypedQuery {
    type:'function',
    id:string|number,
}

function isTypedQuery(query: InfoQuery): query is TypedQuery {
    return "type" in query
}

export function isAlternateQuery(query: InfoQuery): query is AlternateQuery {
    return !("type" in query)
}

export function isFunctionQuery(query: InfoQuery): query is InfoQueryFunction {
    return isTypedQuery(query) && query.type === "function"
}

export interface InfoQueryCommunity extends TypedQuery {
    _treemap_id:number,
}

export function isCommunityQuery(query: InfoQuery): query is InfoQueryCommunity {
    return isTypedQuery(query) && query.type !== "function"
}