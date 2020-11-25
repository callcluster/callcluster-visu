import { CommunityIdentifier } from "./_types";
import getAllFunctionsInside from "./getAllFunctionsInside";
import { Measurable } from "./Measurable";
import Analyzable from "./_Analyzable";

export default class MeasurablesAnalyzer{
    constructor(private analysis:Analyzable){}
    getAllFunctionsInside(subject:Measurable):Set<number>{
        const numberId=parseInt(subject.id.replace("c","").replace("f",""))
        if(subject.type==='function'){
            return new Set([numberId])
        }else{
            return new Set(getAllFunctionsInside(this.analysis.getCommunity(numberId),this.analysis))
        }
    }
    
    identifierIncluded(subject:Measurable,identifiers:CommunityIdentifier[]):boolean{
        return identifiers.includes(subject.id)
    }
}