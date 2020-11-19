
interface MeasurableFields {
    id: string
    type: string
    value: number
    //functions:Set<number>
}

export type Measurable = Record<string, unknown> & MeasurableFields