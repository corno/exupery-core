import { Processor } from "./Processor"



export type Query<Parameters, Result, Error, Resources> = ($r: Resources) => Query_Primed_With_Resources<Parameters, Result, Error>

export type Query_Primed_With_Resources<Parameters, Result, Error> = {
    'execute': ($: Parameters) => Query_Promise<Result, Error>
}

export type Query_Promise<Result, Error> = {

    query_with_result<New_Result>(
        handle_result: Query_Primed_With_Resources<Result, New_Result, Error>
    ): Query_Promise<New_Result, Error>

    query_with_error<New_Error>(
        handle_error: Query_Primed_With_Resources<Error, Result, New_Error>
    ): Query_Promise<Result, New_Error>

    query<New_Result, New_Error>($: {
        'result': Query_Primed_With_Resources<Result, New_Result, New_Error>,
        'error': Query_Primed_With_Resources<Error, New_Result, New_Error>,
    }): Query_Promise<New_Result, New_Error>



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



    map_result<New_Result>(
        handle_result: ($: Result) => New_Result
    ): Query_Promise<New_Result, Error>

    map_error<New_Error>(
        handle_error: ($: Error) => New_Error
    ): Query_Promise<Result, New_Error>

    map<New_Result, New_Error>($: {
        'result': ($: Result) => New_Result,
        'error': ($: Error) => New_Error,
    }): Query_Promise<New_Result, New_Error>



    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}