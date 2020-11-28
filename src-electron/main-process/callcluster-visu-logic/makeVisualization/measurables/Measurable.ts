import { CommunityIdentifier } from "../../types";

interface MeasurableFields {
    id: CommunityIdentifier
    type: string
    value: number|undefined
    //functions:Set<number>
}

export type Measurable = Record<string, unknown> & MeasurableFields