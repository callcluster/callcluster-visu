
interface SubjectFields {
    id: string
    type: string
    value: number
    //functions:Set<number>
}

export type PartialSubject = Record<string, unknown> & SubjectFields