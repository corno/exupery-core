


export type Query<Parameters, Result, Error, Resources> = ($r: Resources) => Query_Primed_With_Resources<Parameters, Result, Error>

export type Query_Primed_With_Resources<Parameters, Result, Error> = ($: Parameters) => Query_Promise<Result, Error>

export type Query_Promise<Result, Error> = {
    map_<NT>(
        handle_value: ($: Result) => NT
    ): Query_Promise<NT, Error>

    map_exception_<NE>(
        handle_exception: ($: Error) => NE
    ): Query_Promise<Result, NE>


    then<NT>(
        handle_value: ($: Result) => Query_Promise<NT, Error>
    ): Query_Promise<NT, Error>

    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}