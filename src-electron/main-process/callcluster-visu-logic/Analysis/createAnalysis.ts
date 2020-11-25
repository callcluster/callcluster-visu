import Analysis from "./Analysis";
import Analyzable from "./_Analyzable";
import { OriginalAnalysisJson } from "./_types";

export default function createAnalysis(analysisJson:OriginalAnalysisJson):Analyzable{
    return new Analysis(analysisJson)
}