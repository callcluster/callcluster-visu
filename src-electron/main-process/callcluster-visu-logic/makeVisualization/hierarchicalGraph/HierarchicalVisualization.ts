import { CommunityIdentifier } from "./_types";
import Visualization from "../Visualization";
export default interface HierarchicalVisualization extends Visualization {
    visualizationType: 'hierarchical',
    openedCommunities?: string[],
    root:CommunityIdentifier
}
