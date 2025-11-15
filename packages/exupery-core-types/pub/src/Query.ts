import { Processor } from "./Processor"



export type Query<Parameters, Result, Error, Resources> = ($r: Resources) => Query_Primed_With_Resources<Parameters, Result, Error>

export type Query_Primed_With_Resources<Parameters, Result, Error> = ($: Parameters) => Query_Promise<Result, Error>

export type Query_Promise<Result, Error> = {


    map_exception<NE>(
        handle_exception: ($: Error) => NE
    ): Query_Promise<Result, NE>

    then<NT>(
        handle_value: ($: Result) => Query_Promise<NT, Error>
    ): Query_Promise<NT, Error>

    process<New_Result>(
        processor: Processor<Result, New_Result, Error>
    ): Query_Promise<New_Result, Error>

    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}