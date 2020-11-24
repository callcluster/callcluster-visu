import { CommunityIdentifier } from "./_types";
import getAllFunctionsInside from "./getAllFunctionsInside";
import { communityIndex } from "../../globals";
import { Measurable } from "./Measurable";

export default class MeasurablesAnalyzer{
    getAllFunctionsInside(subject:Measurable):Set<number>{
        const numberId=parseInt(subject.id.replace("c","").replace("f",""))
        if(subject.type==='function'){
            return new Set([numberId])
        }else{
            return new Set(getAllFunctionsInside(communityIndex.get(numberId)))
        }
    }
    
    identifierIncluded(subject:Measurable,identifiers:CommunityIdentifier[]):boolean{
        return identifiers.includes(subject.id)
    }
}