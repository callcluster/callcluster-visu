import Index from "./Indexer"
import { Community, OriginalAnalysisJson } from "./types";
export function setAnalysisJsonGlobalVariable(localAnalysisJson: any) {
    analysisJson = localAnalysisJson;
}

export let analysisJson: OriginalAnalysisJson;
export let communityIndex = new Index<Community>();