import { CommunityIdentifier } from "./_types";
import Visualization from "../Visualization";
export default interface DiffVisualization extends Visualization {
    visualizationType: 'diff',
    openedCommunities?: string[],
    root:CommunityIdentifier
}
