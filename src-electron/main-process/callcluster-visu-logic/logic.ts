import {
    analysisJson,
    communityIndex,
    setAnalysisJsonGlobalVariable
} from "./globals"
import Analysis from "./Analysis";


// ----------------------------------------- SETTERS -------------------------------------- //


function setAnalysisJson(localAnalysisJson: any) {
    setAnalysisJsonGlobalVariable(localAnalysisJson);
    let analysis = new Analysis(analysisJson,communityIndex)
    analysis.optimize()
}

export { setAnalysisJson };
