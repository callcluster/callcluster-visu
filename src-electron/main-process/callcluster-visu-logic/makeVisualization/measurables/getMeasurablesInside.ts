import { Community } from "./_types";
import { SubjectEvaluator } from "./_makeEvaluator";
import getMeasurableForFunction from "./getMeasurableForFunction";
import getMeasurableForCommunity from "./getMeasurableForCommunity";
import { Measurable } from "./Measurable";
import MeasurablesAnalyzer from "./MeasurablesAnalyzer";
import Analyzable from "./_Analyzable";
import Colorer from "./_Colorer";
export default function getMeasurablesInside(community: Community, evaluator: SubjectEvaluator, analyzable:Analyzable, colorer:Colorer|null): [MeasurablesAnalyzer, Measurable[]] {
    return [new MeasurablesAnalyzer(analyzable), [
        ...analyzable.getFunctionsInside(community)
            .filter(fid => analyzable.isWritten(analyzable.getFunction(fid)))
            .map(id => getMeasurableForFunction(id, evaluator,analyzable, colorer)),
        ...analyzable.getSubCommunities(community)
            .filter(c => !analyzable.isAbstract(c))
            .map(c => getMeasurableForCommunity(c, evaluator, analyzable, colorer)),
    ]]
}