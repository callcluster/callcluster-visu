import Visualization from "../Visualization";
import { CommunityName } from "./_types";
export default interface HierarchicalVisualization extends Visualization {
    visualizationType: 'hierarchical',
    path: CommunityName[],
    openedCommunities?: string[],
}
