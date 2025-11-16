import { Processor } from "./Processor"
import { Transformer_Without_Parameters } from "./Transformer"



export type Query_Procedure<Parameters, Result, Error, Resources> = ($r: Resources) => Query<Parameters, Result, Error>

export type Query<Parameters, Result, Error> = ($: Parameters) => Query_Promise<Result, Error>

export type Query_Promise<Result, Error> = {

    query_with_result<New_Result>(
        query: Query<Result, New_Result, Error>
    ): Query_Promise<New_Result, Error>

    rework_error_with_new_query<New_Error, Rework_Query_Error>(
        query: Query<Error, New_Error, Rework_Query_Error>,
        transform_rework_error: (error: Rework_Query_Error) => New_Error,
    ): Query_Promise<Result, New_Error>

    query<New_Result, New_Error>(queries: {
        'result': Query<Result, New_Result, New_Error>,
        'error': Query<Error, New_Result, New_Error>,
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



    transform_result<New_Result>(
        transformer: (Transformer_Without_Parameters<Result, New_Result>)
    ): Query_Promise<New_Result, Error>

    transform_error<New_Error>(
        transformer: Transformer_Without_Parameters<Error, New_Error>
    ): Query_Promise<Result, New_Error>

    transform<New_Result, New_Error>($: {
        'result': Transformer_Without_Parameters<Result, New_Result>,
        'error': Transformer_Without_Parameters<Error, New_Error>,
    }): Query_Promise<New_Result, New_Error>



    __start(
        on_success: ($: Result) => void,
        on_error: ($: Error) => void
    ): void
}