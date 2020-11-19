import { CommunityIdentifier } from "../../CommunityIdentifier";
import getAllFunctions from "../../getAllFunctions";
import { analysisJson, communityIndex } from "../../globals";
import { PartialSubject } from "./PartialSubject";

export default class Analyzer{
    getAllFunctionsInside(subject:PartialSubject):Set<number>{
        const numberId=parseInt(subject.id.replace("c","").replace("f",""))
        if(subject.type==='function'){
            return new Set([numberId])
        }else{
            return new Set(getAllFunctions(communityIndex.get(numberId)))
        }
    }
    
    identifierIncluded(subject:PartialSubject,identifiers:CommunityIdentifier[]):boolean{
        return identifiers.includes(subject.id)
    }
}