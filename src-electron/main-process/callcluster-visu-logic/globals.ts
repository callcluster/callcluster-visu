import Index from "./Indexer"

export interface Call {
    from: number,
    to: number
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

export function setAnalysisJsonGlobalVariable(localAnalysisJson: any) {
    analysisJson = localAnalysisJson;
}


export let analysisJson: OriginalAnalysisJson;
export let communityIndex = new Index<Community>();