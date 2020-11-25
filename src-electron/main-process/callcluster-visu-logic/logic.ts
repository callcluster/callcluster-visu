import Index from "./Indexer"
import { Metric, Community } from "./types"
import {
    analysisJson,
    communityIndex,
    setAnalysisJsonGlobalVariable
} from "./globals"
import Analysis from "./Analysis";
import Analyzable from "./makeVisualization/_Analyzable";


// ----------------------------------------- SETTERS -------------------------------------- //


function setAnalysisJson(localAnalysisJson: any) {
    setAnalysisJsonGlobalVariable(localAnalysisJson);
    let analysis = new Analysis(analysisJson,communityIndex)
    analysis.optimize()
}

export { setAnalysisJson };
