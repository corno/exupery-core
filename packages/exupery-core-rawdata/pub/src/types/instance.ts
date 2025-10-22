
export type Value =
    | string
    | boolean
    | null
    | number
    | Value[]
    | { [key: string]: Value } //either a dictionary or a verbose group
