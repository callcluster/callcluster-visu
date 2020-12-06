export interface Call {
    from: FunctionId,
    to: FunctionId
}

export type Function = {
    [key: string]: unknown
}

export type Community = {
    [key: string]: unknown
}

export interface OriginalAnalysisJson {
    calls: Call[],
    functions: Function[],
    community: Community
}

export type Metric = string;

export interface FunctionId extends Number {
    dummyFunctions:true
}

export interface CommunityId extends Number {
    dummyCommunities:true
}

export class CommunityIdentifier extends String {
    constructor(source:string){
        super(source)
    }
}

export type CommunityName = string;