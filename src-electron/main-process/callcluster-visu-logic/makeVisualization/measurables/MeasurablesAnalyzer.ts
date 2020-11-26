import { FunctionId } from "./_types";
import getAllFunctionsInside from "./getAllFunctionsInside";
import { Measurable } from "./Measurable";
import Analyzable from "./_Analyzable";
import { CommunityIdentifier } from "./_types";

export default class MeasurablesAnalyzer{
    constructor(private analysis:Analyzable){}
    getAllFunctionsInside(subject:Measurable):Set<FunctionId>{
        if(subject.type==='function'){
            return new Set([this.analysis.getFunctionId(subject.id)])
        }else{
            return new Set(getAllFunctionsInside(this.analysis.getCommunityFromString(subject.id),this.analysis))
        }
    }
    
    identifierIncluded(subject:Measurable,identifiers:CommunityIdentifier[]):boolean{
        return identifiers.includes(subject.id)
    }
}