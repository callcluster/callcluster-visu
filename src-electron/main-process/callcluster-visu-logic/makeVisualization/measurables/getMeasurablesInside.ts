import { analysisJson, Community } from "../../globals";
import { SubjectEvaluator } from "../../SubjectEvaluator";
import getFunctions from "../../getFunctions";
import getSubCommunities from "../../getSubCommunities";
import getMeasurableForFunction from "./getMeasurableForFunction";
import getMeasurableForCommunity from "./getMeasurableForCommunity";
import { Measurable } from "./Measurable";
import isWritten from "../../isWritten";
import isAbstract from "../../isAbstract";
import MeasurablesAnalyzer from "./MeasurablesAnalyzer";
export default function getMeasurablesInside(community: Community, evaluator: SubjectEvaluator): [MeasurablesAnalyzer, Measurable[]] {
    return [new MeasurablesAnalyzer(), [
        ...getFunctions(community)
            .filter(fid => isWritten(analysisJson.functions[fid]))
            .map(id => getMeasurableForFunction(id, evaluator)),
        ...getSubCommunities(community)
            .filter(c => !isAbstract(c))
            .map(c => getMeasurableForCommunity(c, evaluator)),
    ]]
}