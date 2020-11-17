
interface SubjectFields {
    id: string
    type: string,
    value: number
}

export type PartialSubject = Record<string, unknown> & SubjectFields