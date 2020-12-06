import { FunctionId } from "./_types";
import { Measurable } from "./Measurable";
import Analyzable from "./_Analyzable";
import { CommunityIdentifier } from "./_types";

export default class MeasurablesAnalyzer{
    constructor(private analysis:Analyzable){}
    getAllFunctionsInside(subject:Measurable):Set<FunctionId>{
        if(subject.type==='function'){
            return new Set([this.analysis.getFunctionId(subject.id)])
        }else{
            const community = this.analysis.getCommunityFromString(subject.id)
            return new Set(this.analysis.getAllFunctionsInside(community))
        }
    }
    
    identifierIncluded(subject:Measurable,identifiers:CommunityIdentifier[]):boolean{
        return identifiers.includes(subject.id)
    }
}