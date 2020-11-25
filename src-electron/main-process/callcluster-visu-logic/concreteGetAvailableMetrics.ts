import Analysis from "./Analysis";
import { analysisJson, communityIndex } from "./globals";

export default function concreteGetAvailableMetrics(){
    return new Analysis(analysisJson, communityIndex).getAvailableMetrics()
}