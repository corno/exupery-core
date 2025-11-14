import * as _et from "exupery-core-types"

export type Basic_Query_Promise<Result, Error> = {
    __start: (
        on_success: (result: Result) => void,
        on_error: (error: Error) => void,
    ) => void
}