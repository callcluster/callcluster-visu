import { Colorer } from "./makeVisualization";
import { FunctionId, Community, CommunityId } from "./types";
import ExtractedCommunityRepository from "./ExtractedCommunityRepository";
import CommunityRepository from "./CommunityRepository";

class ConcreteFunctionLocator implements FunctionLocator{

    constructor(
        private extractedCommunityRepository:ExtractedCommunityRepository,
        private communityRepository:CommunityRepository,
    ) {}

    findCommunityFor(id: FunctionId, colorer: Colorer): Community|undefined {
        const communityId = this.extractedCommunityRepository.getRoot(colorer.value).communityId as unknown as CommunityId
        const rootCommunity = this.communityRepository.getCommunity(communityId)
        return this.communityRepository.findCommunityFor(id,rootCommunity)
    }
}

export default interface FunctionLocator {
    findCommunityFor(id: FunctionId, colorer: Colorer): Community|undefined;
}

export function createFunctionLocator(extractedRepo:ExtractedCommunityRepository, communityRepo:CommunityRepository ):FunctionLocator{
    return new ConcreteFunctionLocator( extractedRepo, communityRepo)
}