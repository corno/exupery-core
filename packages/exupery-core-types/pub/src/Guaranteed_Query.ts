
export type Guaranteed_Query<Parameters, Result, Resources> = ($r: Resources) => Guaranteed_Query_Primed_With_Resources<Parameters, Result>

export type Guaranteed_Query_Primed_With_Resources<Parameters, Result> = ($: Parameters) => Guaranteed_Query_Promise<Result>


/**
 * A value that will asynchronously become available.
 * Similar to the concept of a promise, but with a smaller API.
 */
export type Guaranteed_Query_Promise<Result> = {

    map<NT>(
        handle_value: ($: Result) => NT
    ): Guaranteed_Query_Promise<NT>

    /**
     * maps the current async value into a new async value
     * @param handle_value callback that transforms the actual value into a new Async_Value
     */
    then<NT>(
        handle_value: ($: Result) => Guaranteed_Query_Promise<NT>
    ): Guaranteed_Query_Promise<NT>

    /**
     * This method is only to be used by resources
     */
    __start(
        on_finished: ($: Result) => void
    ): void
}

export type Basic_Guaranteed_Query_Promise<Result> = {
    __start: (
        on_finished: (result: Result) => void,
    ) => void
}