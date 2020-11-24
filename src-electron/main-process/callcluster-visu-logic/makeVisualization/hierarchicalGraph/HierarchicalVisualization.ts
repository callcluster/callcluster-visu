import Visualization from "../Visualization";
import { CommunityName } from "../../types";
export default interface HierarchicalVisualization extends Visualization {
    visualizationType: 'hierarchical',
    path: CommunityName[],
    openedCommunities?: string[],
}
