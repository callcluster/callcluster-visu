import Visualization from "../Visualization";
import { CommunityIdentifier } from "./_types";
export default interface TreemapVisualization extends Visualization {
    visualizationType: 'treemap',
    root?:CommunityIdentifier
}