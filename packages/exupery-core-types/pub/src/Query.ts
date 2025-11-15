import { Processor } from "./Processor"



export type Query<Parameters, Result, Error, Resources> = ($r: Resources) => Query_Primed_With_Resources<Parameters, Result, Error>

export type Query_Primed_With_Resources<Parameters, Result, Error> = ($: Parameters) => Query_Promise<Result, Error>

export type Query_Promise<Result, Error> = {


    map_error<NE>(
        handle_error: ($: Error) => NE
    ): Query_Promise<Result, NE>

    then<NT>(
        handle_value: ($: Result) => Query_Promise<NT, Error>
    ): Query_Promise<NT, Error>

    process_result<New_Result>(
        processor: Processor<Result, New_Result, Error>
    ): Query_Promise<New_Result, Error>

    process_error<New_Error>(
        processor: Processor<Error, Result, New_Error>
    ): Query_Promise<Result, New_Error>

    process<New_Result, New_Error>($: {
        'result': Processor<Result, New_Result, New_Error>,
        'error': Processor<Error, New_Result, New_Error>,
    }): Query_Promise<New_Result, New_Error>

    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}