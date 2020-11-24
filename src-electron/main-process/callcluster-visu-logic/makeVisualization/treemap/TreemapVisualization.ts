import Visualization from "../Visualization";
import { CommunityName } from "./_types";
export default interface TreemapVisualization extends Visualization {
    visualizationType: 'treemap',
    path: CommunityName[],
}