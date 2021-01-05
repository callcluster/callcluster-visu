import { CommunityIdentifier } from "../../types";

export interface ColorInside{
    id:string
    value:number
}
interface MeasurableFields {
    id: CommunityIdentifier
    type: string
    value: number|undefined
    colorsInside:ColorInside[]
    //functions:Set<number>
}

export type Measurable = Record<string, unknown> & MeasurableFields