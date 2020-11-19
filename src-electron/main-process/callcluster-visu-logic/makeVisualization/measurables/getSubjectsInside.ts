import { analysisJson, Community } from "../../globals";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import getFunctions from "../../getFunctions";
import getSubCommunities from "../../getSubCommunities";
import getSubjectForFunction from "./getSubjectForFunction";
import getSubjectForCommunity from "./getSubjectForCommunity";
import { PartialSubject } from "./PartialSubject";
import isWritten from "../../isWritten";
import isAbstract from "../../isAbstract";
import Analyzer from "./Analyzer";
export default function getSubjectsInside(community: Community, evaluator: SubjectEvaluator): [Analyzer, PartialSubject[]] {
    return [new Analyzer(), [
        ...getFunctions(community)
            .filter(fid => isWritten(analysisJson.functions[fid]))
            .map(id => getSubjectForFunction(id, evaluator)),
        ...getSubCommunities(community)
            .filter(c => !isAbstract(c))
            .map(c => getSubjectForCommunity(c, evaluator)),
    ]]
}