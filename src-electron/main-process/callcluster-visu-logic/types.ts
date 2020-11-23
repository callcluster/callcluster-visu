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
export type Metric = string;
