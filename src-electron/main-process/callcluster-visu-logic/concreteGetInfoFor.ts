import Analysis from "./Analysis";
import getInfoFor, { InfoQuery } from "./getInfoFor";
import { analysisJson, communityIndex } from "./globals";

function concreteGetInfoFor(data:InfoQuery){
    return getInfoFor(data, new Analysis(analysisJson, communityIndex))
}

export { concreteGetInfoFor as getInfoFor }