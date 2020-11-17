import Visualization from "./Visualization";
import { CommunityName } from "./CommunityName";
export default interface HierarchicalVisualization extends Visualization {
    visualizationType: 'hierarchical',
    path: CommunityName[],
    openedCommunities?: string[],
}
