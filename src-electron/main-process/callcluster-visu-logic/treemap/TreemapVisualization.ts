import Visualization from "../Visualization";
import { CommunityName } from "../CommunityName";
export default interface TreemapVisualization extends Visualization {
    visualizationType: 'treemap',
    path: CommunityName[],
}