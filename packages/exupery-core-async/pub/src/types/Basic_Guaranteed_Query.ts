

export type Basic_Guaranteed_Query_Promise<Result> = {
    __start: (
        on_finished: (result: Result) => void,
    ) => void
}